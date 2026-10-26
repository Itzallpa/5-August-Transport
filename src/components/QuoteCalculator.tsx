"use client";

import { useState } from "react";
import { Calculator, Phone, CheckCircle2, ArrowRight, ShieldCheck, Truck, Users, Award } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import Swal from "sweetalert2";
import { DEFAULT_QUOTE_RATES, type QuoteRate } from "@/lib/site-layout";

const REGIONS = [
  { id: "bkk", name: "กรุงเทพฯ และปริมณฑล" },
  { id: "central", name: "ภาคกลาง (อยุธยา, สระบุรี, นครปฐม)" },
  { id: "east", name: "ภาคตะวันออก / แหลมฉบัง (ชลบุรี, ระยอง)" },
  { id: "north", name: "ภาคเหนือ (เชียงใหม่, พิษณุโลก, ลำปาง)" },
  { id: "northeast", name: "ภาคตะวันออกเฉียงเหนือ (โคราช, ขอนแก่น, อุดร)" },
  { id: "south", name: "ภาคใต้ (สุราษฎร์ธานี, สงขลา, ภูเก็ต)" },
];

export default function QuoteCalculator({
  content,
  rates,
}: {
  content?: Partial<SiteContentData>;
  rates?: QuoteRate[];
}) {
  const rateList = rates && rates.length > 0 ? rates : DEFAULT_QUOTE_RATES;
  const TRUCK_RATES: Record<string, QuoteRate> = Object.fromEntries(rateList.map((r) => [r.id, r]));

  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;

  const [origin, setOrigin] = useState("bkk");
  const [destination, setDestination] = useState("east");
  const [truckType, setTruckType] = useState(TRUCK_RATES["6w-standard"] ? "6w-standard" : rateList[0].id);
  const [isUrgent, setIsUrgent] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const getDistanceFactor = (from: string, to: string) => {
    if (from === to) return 1.0;
    if (
      (from === "bkk" && (to === "central" || to === "east")) ||
      (to === "bkk" && (from === "central" || from === "east"))
    ) {
      return 1.6;
    }
    if (from === "north" || to === "north" || from === "south" || to === "south") {
      return 3.2;
    }
    return 2.2;
  };

  const truckInfo = TRUCK_RATES[truckType] || rateList[0];
  const distanceFactor = getDistanceFactor(origin, destination);
  const baseEstimate =
    Math.round(((truckInfo.base * truckInfo.multiplier * distanceFactor * (isUrgent ? 1.2 : 1.0)) / 100)) *
    100;

  const originName = REGIONS.find((r) => r.id === origin)?.name || origin;
  const destName = REGIONS.find((r) => r.id === destination)?.name || destination;

  const handleRequestOfficialQuote = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "สรุปใบเสนอราคาค่าขนส่ง (ประมาณการ)",
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.8;">
          ${customerName ? `<div style="padding: 4px 0;"><strong>ผู้ติดต่อ:</strong> ${customerName} (${customerPhone || "-"})</div>` : ""}
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #E2E8F0;">
            <span style="color: #64748B;">ต้นทาง:</span>
            <strong style="color: #18181B;">${originName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #E2E8F0;">
            <span style="color: #64748B;">ปลายทาง:</span>
            <strong style="color: #18181B;">${destName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #E2E8F0;">
            <span style="color: #64748B;">ประเภทยานพาหนะ:</span>
            <strong style="color: #18181B;">${truckInfo.label}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #E2E8F0;">
            <span style="color: #64748B;">รูปแบบบริการ:</span>
            <strong style="color: ${isUrgent ? "#D97706" : "#18181B"};">${isUrgent ? "งานเร่งด่วนพิเศษ (+20%)" : "บริการมาตรฐาน"}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px; margin-top: 12px; background-color: #FEF2F2; border-radius: 8px; font-size: 18px; font-weight: bold; color: #D32F2F; border: 1px solid #FCA5A5;">
            <span>ประมาณการค่าบริการ:</span>
            <span>~${baseEstimate.toLocaleString()} บาท</span>
          </div>
          <p style="font-size: 11px; color: #64748B; margin-top: 10px;">
            * ราคาที่แสดงเป็นการประมาณการคร่าวๆ ยังไม่รวมภาษีมูลค่าเพิ่ม สำหรับงานสัญญาประจำมีส่วนลดพิเศษ
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "โทรจองคิวรถทันที",
      cancelButtonText: "ปิดหน้าต่าง",
      confirmButtonColor: "#D32F2F",
      cancelButtonColor: "#64748B",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `tel:${phoneRaw}`;
      }
    });
  };

  return (
    <section id="quote" className="py-20 sm:py-24 bg-[#F2F2F4] text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Get A Quote Narrative + 3 Big Counter Stats */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h6 className="text-[#D32F2F] text-xs sm:text-sm font-black uppercase tracking-widest mb-2 font-mono">
                GET A QUOTE
              </h6>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Request A Free Quote <br />
                <span className="text-[#D32F2F]">ประเมินราคาค่าขนส่งฟรี</span>
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              คำนวณและประเมินค่าบริการขนส่งสินค้าได้อย่างรวดเร็ว โปร่งใส และไม่มีค่าใช้จ่ายแอบแฝง พร้อมทีมงานจัดสรรรถที่มีประสบการณ์คอยดูแลตลอด 24 ชั่วโมง ทั้งงานเที่ยวเดียว งานเหมาคัน และสัญญาระยะยาว
            </p>

            {/* FASTER Signature 3 Counter Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-300/80">
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm text-center">
                <h3 className="text-3xl sm:text-4xl font-black text-[#D32F2F] tracking-tight mb-1">
                  200+
                </h3>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  รถในเครือข่ายพร้อมบริการ
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Fleet Vehicles</span>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm text-center">
                <h3 className="text-3xl sm:text-4xl font-black text-[#D32F2F] tracking-tight mb-1">
                  1,000+
                </h3>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  ลูกค้าองค์กรไว้วางใจ
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Corporate Clients</span>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm text-center">
                <h3 className="text-3xl sm:text-4xl font-black text-[#D32F2F] tracking-tight mb-1">
                  100K+
                </h3>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  เที่ยวขนส่งสำเร็จ
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Successful Deliveries</span>
              </div>
            </div>
          </div>

          {/* Right Column: FASTER Signature Primary Red Quote Form Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#D32F2F] rounded-xl p-6 sm:p-8 text-white shadow-2xl border-4 border-white/20">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-white" />
                  <span>คำนวณราคาออนไลน์</span>
                </h3>
                <p className="text-xs text-white/80 mt-1 font-medium">
                  เลือกประเภทรถและเส้นทางเพื่อดูราคาประมาณการทันที
                </p>
              </div>

              <form onSubmit={handleRequestOfficialQuote} className="space-y-4">
                {/* Name & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-white/90 block mb-1">ชื่อผู้ติดต่อ</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="ชื่อ-นามสกุล / บริษัท"
                      className="w-full px-3 py-2.5 rounded bg-white text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-white/90 block mb-1">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="08X-XXX-XXXX"
                      className="w-full px-3 py-2.5 rounded bg-white text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Truck Type Select */}
                <div>
                  <label className="text-[11px] font-bold text-white/90 block mb-1">ประเภทยานพาหนะ</label>
                  <select
                    value={truckType}
                    onChange={(e) => setTruckType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded bg-white text-slate-900 text-xs font-bold focus:outline-none"
                  >
                    {rateList.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Origin & Destination Selects */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-white/90 block mb-1">ภาค/จังหวัดต้นทาง</label>
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full px-3 py-2.5 rounded bg-white text-slate-900 text-xs font-medium focus:outline-none"
                    >
                      {REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/90 block mb-1">ภาค/จังหวัดปลายทาง</label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3 py-2.5 rounded bg-white text-slate-900 text-xs font-medium focus:outline-none"
                    >
                      {REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Urgent Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-[#D32F2F] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-white/95 font-bold">
                    บริการวิ่งด่วนพิเศษ 24 ชม. (+20%)
                  </span>
                </label>

                {/* Live Estimated Price Display */}
                <div className="bg-black/25 rounded-lg p-3.5 border border-white/20 text-center">
                  <span className="text-[11px] text-white/80 block uppercase tracking-wider font-semibold">
                    ราคาประมาณการเบื้องต้น
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight my-0.5">
                    ~{baseEstimate.toLocaleString()} บาท
                  </div>
                  <span className="text-[10px] text-white/70 block">
                    {originName} ➔ {destName} ({truckInfo.label})
                  </span>
                </div>

                {/* Submit / Call Button in Dark Navy #1F1F2E */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded bg-[#1F1F2E] hover:bg-black text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>ขอใบเสนอราคาอย่างเป็นทางการ (Get A Quote)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

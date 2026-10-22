"use client";

import { useState } from "react";
import { Calculator, Phone, MessageSquare, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
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

export default function QuoteCalculator({ content, rates }: { content?: Partial<SiteContentData>; rates?: QuoteRate[] }) {
  const rateList = rates && rates.length > 0 ? rates : DEFAULT_QUOTE_RATES;
  const TRUCK_RATES: Record<string, QuoteRate> = Object.fromEntries(rateList.map((r) => [r.id, r]));
  const quoteTitle = content?.quoteTitle || "ประเมินค่าบริการขนส่ง รวดเร็ว โปร่งใส ยุติธรรม";
  const quoteSubtitle = content?.quoteSubtitle || "เลือกต้นทาง ปลายทาง และประเภทรถเพื่อดูราคาประมาณการเบื้องต้น สำหรับงานประจำ งานเหมาเที่ยว หรือสัญญารายเดือน สามารถติดต่อเจ้าหน้าที่เพื่อรับอัตราพิเศษได้ทันที";
  const quoteNotice = content?.quoteNotice || "* ราคาที่แสดงเป็นการประมาณการคร่าวๆ ยังไม่รวมภาษีมูลค่าเพิ่ม ค่าทางด่วนพิเศษ หรือแรงงานยกสินค้าเสริม";
  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const lineId = content?.lineId || COMPANY_INFO.lineId;

  const [origin, setOrigin] = useState("bkk");
  const [destination, setDestination] = useState("east");
  const [truckType, setTruckType] = useState(TRUCK_RATES["6w-standard"] ? "6w-standard" : rateList[0].id);
  const [isUrgent, setIsUrgent] = useState(false);

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
  const baseEstimate = Math.round(truckInfo.base * truckInfo.multiplier * distanceFactor * (isUrgent ? 1.2 : 1.0) / 100) * 100;

  const originName = REGIONS.find((r) => r.id === origin)?.name || origin;
  const destName = REGIONS.find((r) => r.id === destination)?.name || destination;

  const handleRequestOfficialQuote = () => {
    Swal.fire({
      icon: "info",
      title: "ใบเสนอราคาค่าขนส่ง (ประมาณการ)",
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.8;">
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
          <div style="display: flex; justify-content: space-between; padding: 10px 12px; margin-top: 10px; background-color: #FEF2F2; border-radius: 6px; font-size: 16px; font-weight: bold; color: #D32F2F;">
            <span>ประมาณการค่าบริการ:</span>
            <span>~${baseEstimate.toLocaleString()} บาท</span>
          </div>
          <p style="font-size: 12px; color: #64748B; margin-top: 10px;">
            ${quoteNotice}
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
    <section id="calculator" className="py-20 bg-slate-100 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Context */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#D32F2F] border border-red-200 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>คำนวณราคาขนส่งเบื้องต้น</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {quoteTitle}
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              {quoteSubtitle}
            </p>

            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>รวมประกันภัยสินค้าระหว่างทางทุกเที่ยว</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#D32F2F]" />
                <span>มีระบบ GPS ติดตามสถานะความเร็วและตำแหน่ง</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#D32F2F]" />
                <span>ออกใบเสร็จและใบกำกับภาษีถูกต้องตามกฎหมาย</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm mt-4">
              <div className="text-xs text-slate-500 font-medium">ต้องการขอใบเสนอราคางานประจำ / งานโครงการ</div>
              <div className="text-base font-bold text-slate-800 mt-1">
                โทร: <a href={`tel:${phoneRaw}`} className="text-[#D32F2F] hover:underline">{phone}</a>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">LINE: @{lineId}</div>
            </div>
          </div>

          {/* Right Form Card - Organic Human-Designed Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-lg">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#D32F2F]" />
                  <span>โปรแกรมประเมินราคาค่าขนส่ง (Quick Estimator)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  กรอกข้อมูลจุดรับ-ส่ง และประเภทยานพาหนะเพื่อคำนวณราคาอัตโนมัติ
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Origin */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    จุดรับสินค้า (ต้นทาง)
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:bg-white"
                  >
                    {REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    จุดส่งสินค้า (ปลายทาง)
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:bg-white"
                  >
                    {REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  ประเภทรถที่ต้องการใช้งาน
                </label>
                <select
                  value={truckType}
                  onChange={(e) => setTruckType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:bg-white"
                >
                  {Object.entries(TRUCK_RATES).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgent Toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 p-3 rounded-md border border-slate-200">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-[#D32F2F] focus:ring-[#D32F2F]"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    งานด่วนพิเศษ / เข้ารับสินค้าภายใน 2 ชม. (+20%)
                  </span>
                </label>
              </div>

              {/* Estimate Result Box */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-600 font-medium">ราคาประมาณการเบื้องต้น</div>
                  <div className="text-3xl font-black text-[#D32F2F]">
                    ~{baseEstimate.toLocaleString()} <span className="text-sm font-normal text-slate-600">บาท / เที่ยว</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    เส้นทาง: {originName} ➔ {destName} ({truckInfo.label})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRequestOfficialQuote}
                  className="w-full sm:w-auto px-5 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-md shadow-sm transition-all text-sm flex items-center justify-center gap-2"
                >
                  <span>ดูรายละเอียด / ขอใบเสนอราคา</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center sm:text-left leading-relaxed">
                {quoteNotice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Calculator, Phone, MessageSquare, Shield } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";

const REGIONS = [
  { id: "bkk", name: "กรุงเทพฯ และปริมณฑล" },
  { id: "central", name: "ภาคกลาง (อยุธยา, สระบุรี, นครปฐม)" },
  { id: "east", name: "ภาคตะวันออก / แหลมฉบัง (ชลบุรี, ระยอง)" },
  { id: "north", name: "ภาคเหนือ (เชียงใหม่, พิษณุโลก, ลำปาง)" },
  { id: "northeast", name: "ภาคตะวันออกเฉียงเหนือ (โคราช, ขอนแก่น, อุดร)" },
  { id: "south", name: "ภาคใต้ (สุราษฎร์ธานี, สงขลา, ภูเก็ต)" },
];

const TRUCK_RATES: Record<string, { base: number; multiplier: number; label: string }> = {
  "4w-van": { base: 1200, multiplier: 1.0, label: "4 ล้อ ตู้ทึบ" },
  "4w-jumbo": { base: 1500, multiplier: 1.15, label: "4 ล้อ จัมโบ้" },
  "6w-standard": { base: 2800, multiplier: 1.8, label: "6 ล้อ มาตรฐาน" },
  "6w-jumbo": { base: 3400, multiplier: 2.1, label: "6 ล้อ จัมโบ้" },
  "10w-heavy": { base: 5500, multiplier: 3.2, label: "10 ล้อ" },
  "trailer-heavy": { base: 8500, multiplier: 4.5, label: "รถเทรลเลอร์" },
  "container-prime": { base: 9000, multiplier: 4.8, label: "หัวลาก Container 20/40 FT" },
};

export default function QuoteCalculator({ content }: { content?: Partial<SiteContentData> }) {
  const quoteTitle = content?.quoteTitle || "ประเมินค่าบริการขนส่ง รวดเร็ว โปร่งใส ยุติธรรม";
  const quoteSubtitle = content?.quoteSubtitle || "เลือกต้นทาง ปลายทาง และประเภทรถเพื่อดูราคาประมาณการเบื้องต้น สำหรับงานประจำ งานเหมาเที่ยว หรือสัญญารายเดือน สามารถติดต่อเจ้าหน้าที่เพื่อรับอัตราพิเศษได้ทันที";
  const quoteNotice = content?.quoteNotice || "* ราคาที่แสดงเป็นการประมาณการคร่าวๆ ยังไม่รวมภาษีมูลค่าเพิ่ม ค่าทางด่วนพิเศษ หรือแรงงานยกสินค้าเสริม";
  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const lineId = content?.lineId || COMPANY_INFO.lineId;

  const [origin, setOrigin] = useState("bkk");
  const [destination, setDestination] = useState("east");
  const [truckType, setTruckType] = useState("6w-standard");
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

  const truckInfo = TRUCK_RATES[truckType] || TRUCK_RATES["6w-standard"];
  const distanceFactor = getDistanceFactor(origin, destination);
  const baseEstimate = Math.round(truckInfo.base * truckInfo.multiplier * distanceFactor * (isUrgent ? 1.2 : 1.0) / 100) * 100;

  return (
    <section className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Header & Context */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-red-400 text-xs font-bold uppercase tracking-wider border border-slate-800">
              <Calculator className="w-3.5 h-3.5" />
              <span>คำนวณราคาขนส่งเบื้องต้น</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {quoteTitle}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed font-light">
              {quoteSubtitle}
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Shield className="w-4 h-4" />
                <span>รวมประกันภัยสินค้าระหว่างทางทุกเที่ยว</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {quoteNotice}
              </p>
            </div>
          </div>


          {/* Right Interactive Form */}
          <div className="lg:col-span-7 bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl shadow-black/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200">จุดต้นทาง (จุดรับสินค้า):</label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  aria-label="จุดต้นทาง (จุดรับสินค้า)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-red-500"
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200">จุดปลายทาง (จุดส่งมอบ):</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  aria-label="จุดปลายทาง (จุดส่งมอบ)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-red-500"
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Truck Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200">ประเภทยานพาหนะที่ต้องการ:</label>
              <select
                value={truckType}
                onChange={(e) => setTruckType(e.target.value)}
                aria-label="ประเภทยานพาหนะที่ต้องการ"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-red-500"
              >
                {Object.entries(TRUCK_RATES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgent Toggle */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <input
                type="checkbox"
                id="urgent"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <label htmlFor="urgent" className="text-xs sm:text-sm text-slate-300 select-none cursor-pointer">
                งานเร่งด่วนพิเศษ / ต้องการเข้ารับสินค้าภายใน 2 ชั่วโมง
              </label>
            </div>

            {/* Result Calculation Display */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400">ราคาประมาณการเบื้องต้น</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    ฿{baseEstimate.toLocaleString()}
                  </span>
                  <span className="text-xs text-red-400 font-medium">/ เที่ยว</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${phoneRaw}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs sm:text-sm font-bold shadow-md shadow-black/20 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>โทรจองคิว: {phone}</span>
                </a>

                <a
                  href={`https://line.me/ti/p/~${lineId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  title="แชท LINE ขอใบเสนอราคา"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

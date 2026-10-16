"use client";

import { useState } from "react";
import Image from "next/image";
import { FLEET_CATEGORIES, COMPANY_INFO } from "@/lib/constants";
import { Truck, CheckCircle2, Ruler, Weight, Box, Sparkles, ArrowRight } from "lucide-react";

export default function FleetSection() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedVehicle, setSelectedVehicle] = useState<typeof FLEET_CATEGORIES[0] | null>(null);

  const filteredFleet = FLEET_CATEGORIES.filter((item) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "4W") return item.id.startsWith("4w");
    if (activeFilter === "6W") return item.id.startsWith("6w");
    if (activeFilter === "HEAVY") return item.id.startsWith("10w") || item.id.startsWith("trailer") || item.id.startsWith("container");
    return true;
  });

  return (
    <section id="fleet" className="py-24 bg-slate-50 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ประเภทรถที่ให้บริการ • ตอบโจทย์ทุกประเภทงานขนส่ง</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            กองยานพาหนะมาตรฐานระดับสากล
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            พร้อมตอบสนองทุกโจทย์ธุรกิจ ตั้งแต่การจัดส่งสินค้าพัสดุด่วนในเมือง (Last-Mile) จนถึงการขนส่งสินค้าอุตสาหกรรมข้ามภาค และงานตู้คอนเทนเนอร์นำเข้า-ส่งออก
          </p>
        </div>

        {/* Fleet Lineup Banner */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden mb-12 shadow-2xl border border-slate-200">
          <Image
            src="/images/fleet.jpg"
            alt="5 August Transport Vehicle Fleet Lineup"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end p-6 sm:p-10">
            <div className="space-y-2 text-white max-w-xl">
              <span className="px-3 py-1 rounded-md bg-[#D32F2F] text-xs font-bold uppercase tracking-wider">
                Full-Scale Fleet
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                มีรถพร้อมวิ่งมากกว่า 200 คัน ตรวจสภาพและบำรุงรักษาตามรอบสม่ำเสมอ
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light">
                ทุกคันติดตั้ง GPS Tracking ควบคุมความเร็วตามกฎหมายกรมการขนส่งทางบก
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {[
            { id: "ALL", label: "ทั้งหมด (7 ประเภท)" },
            { id: "4W", label: "รถ 4 ล้อ (ตู้ทึบ / จัมโบ้)" },
            { id: "6W", label: "รถ 6 ล้อ (มาตรฐาน / จัมโบ้)" },
            { id: "HEAVY", label: "รถ 10 ล้อ / เทรลเลอร์ / คอนเทนเนอร์" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeFilter === tab.id
                  ? "bg-[#D32F2F] text-white shadow-lg shadow-red-700/25 scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFleet.map((truck) => (
            <div
              key={truck.id}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 hover:border-red-400 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    {truck.badge}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-[#D32F2F] group-hover:text-white transition-colors">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>

                {/* Truck Names */}
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#D32F2F] transition-colors">
                  {truck.name}
                </h3>
                <p className="text-sm font-medium text-slate-500 mb-5">
                  {truck.subName}
                </p>

                {/* Specs Box */}
                <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-semibold">{truck.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{truck.dimensions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{truck.volume}</span>
                  </div>
                </div>

                {/* Ideal for */}
                <p className="text-xs text-slate-600 mb-5 line-clamp-2">
                  <span className="font-semibold text-slate-800">ลักษณะงาน: </span>
                  {truck.idealFor}
                </p>

                {/* Highlights List */}
                <ul className="space-y-1.5 mb-6 text-xs text-slate-600">
                  {truck.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="flex-1 text-center py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-[#D32F2F] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  สอบถามคิวรถ / ขอใบเสนอราคา
                </a>
                <button
                  onClick={() => setSelectedVehicle(truck)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium"
                  title="ดูรายละเอียดเพิ่มเติม"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for detail view */}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-[#D32F2F]">
                    {selectedVehicle.badge}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    {selectedVehicle.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {selectedVehicle.subName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-slate-100">
                  <p><strong>น้ำหนักบรรทุก:</strong> {selectedVehicle.capacity}</p>
                  <p><strong>ขนาดกระบะบรรทุก:</strong> {selectedVehicle.dimensions}</p>
                  <p><strong>ปริมาตรลูกบาศก์เมตร:</strong> {selectedVehicle.volume}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">ความเหมาะสมสำหรับธุรกิจ:</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedVehicle.idealFor}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">จุดเด่นของรุ่นนี้:</h4>
                  <ul className="space-y-1.5">
                    {selectedVehicle.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="flex-1 py-3 text-center rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-md"
                >
                  โทรจองคิวรถ: {COMPANY_INFO.phone}
                </a>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

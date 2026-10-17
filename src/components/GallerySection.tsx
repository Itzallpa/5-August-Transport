"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, CheckCircle2, MapPin, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  category: "all" | "loading" | "route" | "fleet";
  categoryLabel: string;
  location: string;
  image: string;
  description: string;
  highlight: string;
};

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "ทีมงานยกสินค้าและจัดของขึ้นตู้ขนส่ง ณ คลังกระจายสินค้า",
    category: "loading",
    categoryLabel: "งานยกและโหลดสินค้า",
    location: "ศูนย์กระจายสินค้า บางพลี สมุทรปราการ",
    image: "/images/thai_transport_loading.jpg",
    description: "ทีมงานมืออาชีพมีคนช่วยยกสินค้าและตรวจนับจำนวนอย่างรอบคอบ พร้อมอุปกรณ์โฟล์กลิฟต์และสายรัดกันกระแทกมาตรฐานสากล",
    highlight: "มีคนช่วยยกของ ลูกค้าไม่ต้องออกแรงเอง",
  },
  {
    id: "g2",
    title: "กองรถ 5 สิงหา ทรานสปอร์ต วิ่งงานขนส่งสายเหนือและต่างจังหวัด",
    category: "route",
    categoryLabel: "การขนส่งบนเส้นทางจริง",
    location: "เส้นทางทางหลวงแผ่นดิน สู่ภาคเหนือและภาคอีสาน",
    image: "/images/thai_transport_highway.jpg",
    description: "รถขนส่งควบคุมความเร็วด้วย GPS ตลอด 24 ชม. คนขับชำนาญเส้นทาง ส่งตรงเวลา สินค้าถึงปลายทางอย่างปลอดภัย 100%",
    highlight: "วิ่งงานได้ตลอด 24 ชั่วโมง ปลอดภัยทุกเส้นทาง",
  },
  {
    id: "g3",
    title: "ลานจอดและศูนย์ปฏิบัติการกองยานพาหนะ (Fleet Yard) กว่า 200+ คัน",
    category: "fleet",
    categoryLabel: "กองยานพาหนะของบริษัท",
    location: "ศูนย์ปฏิบัติการใหญ่ 5 August Transport",
    image: "/images/thai_transport_fleet_yard.jpg",
    description: "มีรถรองรับงานทุกวัน ทั้งกระบะ 4 ล้อ, รถ 6 ล้อ, 10 ล้อ และหัวลาก ตรวจสภาพรถสม่ำเสมอพร้อมออกวิ่งได้ทันที",
    highlight: "กองรถพร้อมให้บริการมากกว่า 200+ คัน",
  },
  {
    id: "g4",
    title: "ภาพรวมกองรถขนส่ง 4 ล้อ, 6 ล้อ และ 10 ล้อ พร้อมทีมงานประจำ",
    category: "fleet",
    categoryLabel: "มาตรฐานกองรถ",
    location: "ศูนย์ประสานงานขนส่งสินค้าทั่วไทย",
    image: "/images/thai_transport_hero.jpg",
    description: "ตัวถังตู้ทึบสะอาด กันน้ำ กันฝน 100% พร้อมบริการงานเหมาคัน รายเที่ยว และสัญญารายเดือนจากพันธมิตรชั้นนำ",
    highlight: "ตู้ทึบสะอาด กันฝน 100% มีประกันสินค้า",
  },
];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-white via-slate-50 to-white text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#D32F2F] border border-red-200 text-xs font-bold tracking-wide">
            <Camera className="w-3.5 h-3.5" />
            <span>แกลเลอรี่ผลงานและภาพการปฏิบัติงานจริง</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ภาพผลงานจริง <span className="text-[#D32F2F]">5 August Transport</span>
          </h2>

          <p className="text-slate-600 text-base font-normal max-w-2xl mx-auto leading-relaxed">
            สัมผัสความพร้อมของกองยานพาหนะและทีมงานมืออาชีพ การโหลดสินค้า การจัดส่งตรงเวลา และมาตรฐานความปลอดภัยในทุกเที่ยวการเดินทาง
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {[
            { id: "all", label: "ภาพผลงานทั้งหมด" },
            { id: "loading", label: "งานยกและโหลดสินค้า" },
            { id: "route", label: "วิ่งงานบนเส้นทางจริง" },
            { id: "fleet", label: "ลานจอดและกองรถ" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeCategory === tab.id
                  ? "bg-[#D32F2F] text-white shadow-red-200 scale-105"
                  : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold">
                  {item.categoryLabel}
                </div>
                <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-sm border border-white/60 shadow-md flex items-center justify-between text-xs text-slate-800 font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.highlight}</span>
                  </span>
                  <span className="text-[#D32F2F] font-bold text-[11px] shrink-0 flex items-center gap-1">
                    <span>ดูภาพใหญ่</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                  <span>{item.location}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#D32F2F] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-red-50 via-white to-red-50 border border-red-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#D32F2F] text-white flex items-center justify-center shrink-0 shadow-md font-bold text-2xl">
              ✓
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                มั่นใจทุกเที่ยวการขนส่ง การันตีความปลอดภัยและตรงต่อเวลา
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                มีคนช่วยยกสินค้า ดูแลสินค้าตั้งแต่ต้นทางจนถึงมือผู้รับปลายทางอย่างสมบูรณ์แบบ
              </p>
            </div>
          </div>
          <a
            href="#calculator"
            className="px-6 py-3 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all shrink-0"
          >
            ประเมินราคาขนส่งทันที
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-80 sm:h-96 bg-slate-900">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center font-bold text-lg shadow-md transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-red-50 text-[#D32F2F] text-xs font-bold border border-red-200">
                  {selectedImage.categoryLabel}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D32F2F]" />
                  {selectedImage.location}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{selectedImage.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

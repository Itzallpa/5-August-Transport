"use client";

import { useState } from "react";
import Image from "next/image";
import { Truck, ArrowRight, PhoneCall, Search, ShieldCheck, CheckCircle2 } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import Swal from "sweetalert2";

export default function Hero({ content }: { content?: Partial<SiteContentData> }) {
  const [trackingId, setTrackingId] = useState("");

  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const heroImage = content?.heroImageUrl || "/images/hero-cover-v2.jpg";

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุเลขพัสดุ",
        text: "โปรดใส่หมายเลขติดตามพัสดุ หรือ จังหวัดปลายทางเพื่อตรวจสอบ",
        confirmButtonColor: "#D32F2F",
      });
      return;
    }

    Swal.fire({
      icon: "info",
      title: "ระบบตรวจสอบสถานะขนส่ง",
      html: `
        <div class="text-left text-sm space-y-2">
          <p>หมายเลขติดตาม: <strong class="text-slate-900">${trackingId}</strong></p>
          <div class="p-3 bg-red-50 border border-red-200 rounded text-[#D32F2F] font-medium text-xs">
            รถขนส่งอยู่ในระหว่างการปฏิบัติงานควบคุมด้วยระบบ GPS Tracking เรียลไทม์
          </div>
          <p class="text-xs text-slate-500 mt-2">ต้องการสอบถามสถานะเพิ่มเติม โปรดติดต่อศูนย์ควบคุมเดินรถ 24 ชม.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "โทรหาศูนย์ควบคุม",
      cancelButtonText: "ปิดหน้าต่าง",
      confirmButtonColor: "#D32F2F",
    }).then((res) => {
      if (res.isConfirmed) {
        window.location.href = `tel:${phoneRaw}`;
      }
    });
  };

  return (
    <section id="home" className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden border-b border-slate-200">
      {/* Background Hero Image with FASTER dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="5 August Transport Logistics Fleet"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F1F2E]/95 via-[#1F1F2E]/85 to-[#1F1F2E]/90 backdrop-blur-[1px]" />
      </div>

      {/* Hero Content in FASTER Center Alignment */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center flex flex-col items-center">
        {/* Subtitle in Signature Primary Red */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-[#FF4800] sm:text-[#FF4800] text-red-400 text-xs sm:text-sm font-black uppercase tracking-widest mb-6">
          <Truck className="w-4 h-4 text-[#D32F2F]" />
          <span>SAFE & FASTER • 5 AUGUST TRANSPORT</span>
        </div>

        {/* Display Headline */}
        <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
          บริการขนส่งสินค้าและโลจิสติกส์ด่วนทั่วไทย <br className="hidden sm:inline" />
          <span className="text-[#D32F2F]">Logistics Services</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-lg max-w-3xl mb-10 leading-relaxed font-normal">
          พันธมิตรขนส่ง KEX Express - Linehaul และบริการขนส่งเหมาคัน รายเที่ยว สัญญารายเดือน กองยานพาหนะ 4 ล้อ, 4 ล้อจัมโบ้, 6 ล้อ ครอบคลุมทั่วประเทศ ปลอดภัย ควบคุมด้วย GPS ตลอด 24 ชม.
        </p>

        {/* FASTER Signature Track & Trace Input Bar */}
        <form onSubmit={handleTrack} className="w-full max-w-2xl mb-8">
          <div className="flex flex-col sm:flex-row shadow-2xl rounded-lg overflow-hidden border-2 border-white/20 bg-white/10 backdrop-blur-md p-1.5 gap-2 sm:gap-0">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="ระบุรหัสติดตามพัสดุ (Tracking ID) หรือ จุดหมายปลายทาง..."
                className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none rounded sm:rounded-r-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-extrabold text-sm uppercase tracking-wider transition-all duration-200 shrink-0 rounded sm:rounded-l-none flex items-center justify-center gap-2 shadow"
            >
              <span>Track & Trace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#quote"
            className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>ขอใบเสนอราคา (Get A Quote)</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#recruitment"
            className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/30 backdrop-blur-sm transition-all hover:scale-105"
          >
            <span>สมัครร่วมงานคนขับ (Careers)</span>
          </a>

          <a
            href={`tel:${phoneRaw}`}
            className="px-5 py-3 sm:py-3.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all hover:scale-105 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-[#D32F2F]" />
            <span>โทร: {phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

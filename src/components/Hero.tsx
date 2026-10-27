"use client";

import { useState } from "react";
import Image from "next/image";
import { Truck, ArrowRight, PhoneCall, Search, MessageSquare, ShieldCheck } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SiteLayout } from "@/lib/site-layout";
import { Editable, ImageEditButton } from "@/components/editor/EditorContext";
import Swal from "sweetalert2";

export default function Hero({
  content,
  layout,
}: {
  content?: Partial<SiteContentData>;
  layout?: SiteLayout;
}) {
  const [trackingId, setTrackingId] = useState("");

  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const lineId = content?.lineId && content.lineId !== "0843263546" ? content.lineId : "@486eyver";
  const rawHeroImage = content?.heroImageUrl;
  const heroBackgroundImage = (!rawHeroImage || rawHeroImage === "/images/hero-cover.jpg") 
    ? "/images/hero-cover-v2.jpg?v=3" 
    : `${rawHeroImage}?v=3`;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุเลขพัสดุหรือปลายทาง",
        text: "โปรดใส่หมายเลขติดตามพัสดุ (Tracking ID) หรือ จังหวัดปลายทางเพื่อตรวจสอบ",
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
            รถขนส่งอยู่ในระหว่างการปฏิบัติงานควบคุมด้วยระบบ GPS Tracking เรียลไทม์ ตลอด 24 ชม.
          </div>
          <p class="text-xs text-slate-500 mt-2">ต้องการสอบถามสถานะเพิ่มเติม โปรดติดต่อศูนย์ควบคุมเดินรถ</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "โทรหาศูนย์ควบคุม 24 ชม.",
      cancelButtonText: "ปิดหน้าต่าง",
      confirmButtonColor: "#D32F2F",
    }).then((res) => {
      if (res.isConfirmed) {
        window.location.href = `tel:${phoneRaw}`;
      }
    });
  };

  return (
    <section id="home" className="relative w-full bg-gradient-to-b from-slate-100 via-white to-slate-50 py-4 sm:py-6 px-3 sm:px-6 md:px-8 border-b border-slate-200 overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col items-center">
        {/* 1. Main Hero Banner Frame - 100% Crystal Clear Master Infographic (No Blur, No Dimming Overlay) */}
        <div className="w-full">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-slate-200/90 bg-white ring-1 ring-slate-900/5 group">
            <ImageEditButton field="heroImageUrl" label="📷 เปลี่ยนรูป Hero Banner" className="absolute top-4 right-4 z-30" />
            <a href="#recruitment" className="block cursor-pointer w-full" title="คลิกเพื่อดูรายละเอียดและสมัครร่วมงาน">
              {/* Desktop Widescreen Banner (3200x1312) - High Resolution Crisp Image */}
              <Image
                src={heroBackgroundImage}
                alt="5 August Transport x KEX Express Partner - บริการขนส่งและรับสมัครรถร่วม"
                width={3200}
                height={1312}
                priority
                unoptimized
                className="hidden sm:block w-full h-auto object-contain select-none"
              />
              {/* Mobile Seamless Portrait Banner (1440x2105) */}
              <Image
                src="/images/hero-cover-mobile.jpg?v=3"
                alt="5 August Transport x KEX Express Partner - บริการขนส่งและรับสมัครรถร่วม"
                width={1440}
                height={2105}
                priority
                unoptimized
                className="sm:hidden w-full h-auto block select-none"
              />
            </a>
          </div>
        </div>

        {/* 2. FASTER Interactive Command Console (Track & Trace + Fast Actions) */}
        <div className="w-full max-w-6xl mt-4 sm:mt-5 bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200/90 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* FASTER Track & Trace Search Form */}
            <form onSubmit={handleTrack} className="flex-1 w-full flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="ระบุรหัสติดตามพัสดุ (Tracking ID) หรือ ปลายทางเพื่อคำนวณราคา..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md shadow-red-950/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Track & Trace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Action CTA Group */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0">
              <a
                href="#quote"
                className="px-5 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-red-950/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <Editable field="t:hero:ctaQuote" value={layout?.textOverrides?.["t:hero:ctaQuote"] || "ขอใบเสนอราคา"} noTransform />
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#recruitment"
                className="px-5 py-3 rounded-xl bg-[#1F1F2E] hover:bg-black text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 text-center"
              >
                <Editable field="heroCtaDriverText" value={content?.heroCtaDriverText || "สมัครร่วมงานคนขับ"} noTransform />
              </a>

              <a
                href={`tel:${phoneRaw}`}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#D32F2F]" />
                <Editable field="phone" value={phone} noTransform />
              </a>

              <a
                href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-[#06C755] hover:bg-[#05a847] text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>LINE</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

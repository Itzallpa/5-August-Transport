import Image from "next/image";
import { Truck, ArrowRight, ShieldCheck, Clock, Award, PhoneCall, MessageCircle } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { Editable, ImageEditButton, Movable } from "@/components/editor/EditorContext";

export default function Hero({ content }: { content?: Partial<SiteContentData> }) {
  const heroCtaDriverText = content?.heroCtaDriverText || "สมัครขับรถร่วมกับเรา";
  const phone = content?.phone || "084-326-3546";
  const phoneRaw = content?.phoneRaw || "0843263546";
  const lineId = (content?.lineId && content.lineId !== "0843263546") ? content.lineId : "@486eyver";

  // Background Image (CMS upload or fallback hero image)
  const heroBackgroundImage = content?.heroImageUrl || "/images/hero-cover-v2.jpg";

  return (
    <section id="home" className="relative w-full bg-gradient-to-b from-slate-100 via-white to-slate-50 py-2 sm:py-4 px-2 sm:px-4 md:px-6 border-b border-slate-200 overflow-hidden">
      {/* Container matching user's exact drawn rectangular frame (width + vertical height) */}
      <div className="max-w-[1780px] mx-auto w-full flex flex-col items-center">
        {/* 1. Main Hero Banner Frame - Full original image without any crop or distortion */}
        <Movable field="heroBannerCard" className="w-full">
          <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-slate-200/90 bg-white ring-1 ring-slate-900/5 group">
            <a href="#recruitment" className="block w-full cursor-pointer">
              <Image
                src={heroBackgroundImage}
                alt="5 August Transport x KEX Express Partner"
                width={3200}
                height={1312}
                priority
                unoptimized
                sizes="(max-width: 1920px) 100vw, 1780px"
                className="w-full h-auto block select-none"
              />
            </a>

            {/* Admin Image Edit Button */}
            <ImageEditButton
              field="heroImageUrl"
              label="📷 เปลี่ยนรูปภาพหน้าปก"
              className="absolute top-3 right-3 z-30 pointer-events-auto shadow-md"
            />
          </div>
        </Movable>

        {/* 2. Interactive Action Bar - Prominent, beautiful, and does NOT block the banner graphics */}
        <Movable field="heroCtaGroup" className="w-full mt-3 sm:mt-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5">
            {/* 🔴 Apply Now */}
            <Movable field="heroCtaDriverBtn" className="inline-block">
              <a
                href="#recruitment"
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#8E0000] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] border border-red-500/40 text-center"
              >
                <Truck className="w-4 h-4 text-white shrink-0" />
                <span>
                  <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform />
                </span>
                <ArrowRight className="w-4 h-4 ml-0.5 shrink-0" />
              </a>
            </Movable>

            {/* ⚪ Contact Us */}
            <Movable field="heroContactBtn" className="inline-block">
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                <PhoneCall className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <span>ติดต่อเรา</span>
              </a>
            </Movable>

            {/* 📞 Phone */}
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>โทร: {phone}</span>
            </a>

            {/* 💬 LINE */}
            <a
              href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 text-white shrink-0" />
              <span>LINE: {lineId}</span>
            </a>
          </div>
        </Movable>

        {/* 3. Subtle Corporate Trust Badges */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>ประกันภัยสินค้าทุกเที่ยว 100%</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>GPS ติดตามสถานะเรียลไทม์ 24 ชม.</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Award className="w-4 h-4 text-[#D32F2F] shrink-0" />
            <span>พันธมิตรเครือข่าย KEX Express</span>
          </div>
        </div>
      </div>
    </section>
  );
}

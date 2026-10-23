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
  const heroBackgroundImage = content?.heroImageUrl || "/images/hero-cover.jpg";

  return (
    <section id="home" className="relative w-full bg-gradient-to-b from-slate-100 via-white to-slate-50 pt-4 pb-8 sm:py-8 px-3 sm:px-6 lg:px-8 border-b border-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* 1. The Main Hero Banner Card - Clean, crisp, 100% uncropped, matching website theme */}
        <Movable field="heroBannerCard" className="w-full">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-slate-200/90 bg-white ring-1 ring-slate-900/5 group">
            <Image
              src={heroBackgroundImage}
              alt="5 August Transport x KEX Express Partner"
              width={1024}
              height={687}
              priority
              unoptimized
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="w-full h-auto block select-none"
            />

            {/* Admin Image Edit Button */}
            <ImageEditButton
              field="heroImageUrl"
              label="📷 เปลี่ยนรูปภาพหน้าปก"
              className="absolute top-3 right-3 z-30 pointer-events-auto shadow-md"
            />
          </div>
        </Movable>

        {/* 2. Dedicated Corporate Action Bar Below Banner - Clean, elegant, no ugly overlay on trucks */}
        <Movable field="heroCtaGroup" className="w-full">
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
            {/* Primary Action: Apply Now */}
            <Movable field="heroCtaDriverBtn" className="inline-block">
              <a
                href="#recruitment"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#8E0000] text-white font-bold text-sm sm:text-base shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Truck className="w-5 h-5 text-white shrink-0" />
                <span>
                  <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform /> (Apply Now)
                </span>
                <ArrowRight className="w-4 h-4 ml-0.5 shrink-0" />
              </a>
            </Movable>

            {/* Secondary Action: Contact Us */}
            <Movable field="heroContactBtn" className="inline-block">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-sm transition-all duration-200 hover:border-slate-400 hover:scale-[1.02] active:scale-[0.98]"
              >
                <PhoneCall className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <span>ติดต่อเรา (Contact Us)</span>
              </a>
            </Movable>

            {/* Direct Phone Quick Link */}
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold text-xs sm:text-sm border border-slate-200 shadow-sm transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>โทรด่วน: {phone}</span>
            </a>

            {/* LINE Quick Link */}
            <a
              href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-[#06C755]/10 hover:bg-[#06C755]/20 text-[#06C755] font-bold text-xs sm:text-sm border border-[#06C755]/30 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#06C755]" />
              <span>LINE: {lineId}</span>
            </a>
          </div>
        </Movable>

        {/* 3. Subtle Corporate Trust Badges */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-500">
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

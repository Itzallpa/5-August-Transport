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
        {/* 1. Main Hero Banner Frame - Fills the exact frame with natural 3200x1312 aspect ratio (no stretch!) */}
        <Movable field="heroBannerCard" className="w-full">
          <div className="relative w-full aspect-[3200/1312] max-h-[82vh] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-slate-200/90 bg-white ring-1 ring-slate-900/5 group">
            <Image
              src={heroBackgroundImage}
              alt="5 August Transport x KEX Express Partner"
              fill
              priority
              unoptimized
              sizes="(max-width: 1920px) 100vw, 1780px"
              className="w-full h-full object-cover select-none"
            />

            {/* Admin Image Edit Button */}
            <ImageEditButton
              field="heroImageUrl"
              label="📷 เปลี่ยนรูปภาพหน้าปก"
              className="absolute top-3 right-3 z-30 pointer-events-auto shadow-md"
            />

            {/* 2. Floating Action Buttons Docked EXACTLY in the Box Marked by User (in front of KEX 10W truck) */}
            <Movable field="heroCtaGroup" className="absolute bottom-2.5 sm:bottom-4 md:bottom-5 right-2 sm:right-4 md:right-6 z-20 pointer-events-auto">
              <div className="bg-black/60 backdrop-blur-md p-1.5 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl border border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.7)] w-auto max-w-[280px] sm:max-w-[380px] md:max-w-[440px] flex flex-col gap-1 sm:gap-2">
                {/* Top Row: Primary Actions */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
                  {/* 🔴 Apply Now */}
                  <Movable field="heroCtaDriverBtn" className="block">
                    <a
                      href="#recruitment"
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#8E0000] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] border border-red-500/40 text-center"
                    >
                      <Truck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white shrink-0" />
                      <span className="truncate">
                        <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform />
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5 shrink-0 hidden sm:inline" />
                    </a>
                  </Movable>

                  {/* ⚪ Contact Us */}
                  <Movable field="heroContactBtn" className="block">
                    <a
                      href="#contact"
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm border border-white/60 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
                    >
                      <PhoneCall className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#D32F2F] shrink-0" />
                      <span className="truncate">ติดต่อเรา</span>
                    </a>
                  </Movable>
                </div>

                {/* Bottom Row: Direct Phone & LINE Quick Contacts */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
                  {/* 📞 Phone */}
                  <a
                    href={`tel:${phoneRaw}`}
                    className="flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-black/60 hover:bg-black/80 text-white font-semibold text-[11px] sm:text-xs border border-white/20 backdrop-blur-md transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">โทร: {phone}</span>
                  </a>

                  {/* 💬 LINE */}
                  <a
                    href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#06C755]/25 hover:bg-[#06C755]/35 text-emerald-300 font-bold text-[11px] sm:text-xs border border-[#06C755]/40 backdrop-blur-md transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#06C755] shrink-0" />
                    <span className="truncate">LINE: {lineId}</span>
                  </a>
                </div>
              </div>
            </Movable>
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

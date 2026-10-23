import Image from "next/image";
import { Truck, ArrowRight, PhoneCall, MessageCircle } from "lucide-react";
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
    <section id="home" className="relative w-full bg-gradient-to-b from-slate-100 via-white to-slate-50 py-2 sm:py-3 px-2 sm:px-4 md:px-6 border-b border-slate-200 overflow-hidden">
      {/* Container calibrated to fit 100% within the viewport height without vertical scrolling */}
      <div className="max-w-[1720px] mx-auto w-full flex flex-col items-center">
        {/* 1. Main Hero Banner Frame - Height constrained to available viewport, width scales proportionally */}
        <Movable field="heroBannerCard" className="relative inline-block max-w-full">
          <div className="relative inline-block rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-slate-200/90 bg-white ring-1 ring-slate-900/5 group">
            <a href="#recruitment" className="block cursor-pointer">
              <Image
                src={heroBackgroundImage}
                alt="5 August Transport x KEX Express Partner"
                width={3200}
                height={1312}
                priority
                unoptimized
                className="w-auto h-auto max-h-[calc(100vh-170px)] sm:max-h-[calc(100vh-165px)] md:max-h-[660px] max-w-full block select-none"
              />
            </a>

            {/* Admin Image Edit Button */}
            <ImageEditButton
              field="heroImageUrl"
              label="📷 เปลี่ยนรูปภาพหน้าปก"
              className="absolute top-3 right-3 z-30 pointer-events-auto shadow-md"
            />

            {/* 2. Floating Action Buttons Console (Desktop only - Docked in the circle marked by user in front of KEX 10W truck) */}
            <Movable field="heroCtaGroup" className="hidden sm:block absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 z-20 pointer-events-auto">
              <div className="bg-black/70 backdrop-blur-md p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-white/30 shadow-[0_12px_30px_rgba(0,0,0,0.7)] w-auto max-w-[320px] sm:max-w-[360px] md:max-w-[400px] flex flex-col gap-1 sm:gap-1.5">
                {/* Top Row: Primary Actions */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {/* 🔴 Apply Now */}
                  <Movable field="heroCtaDriverBtn" className="block">
                    <a
                      href="#recruitment"
                      className="w-full flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#8E0000] text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] border border-red-500/40 text-center"
                    >
                      <Truck className="w-3.5 h-3.5 text-white shrink-0" />
                      <span className="truncate">
                        <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform />
                      </span>
                      <ArrowRight className="w-3 h-3 shrink-0 hidden sm:inline" />
                    </a>
                  </Movable>

                  {/* ⚪ Contact Us */}
                  <Movable field="heroContactBtn" className="block">
                    <a
                      href="#contact"
                      className="w-full flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs border border-white/60 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                      <span className="truncate">ติดต่อเรา</span>
                    </a>
                  </Movable>
                </div>

                {/* Bottom Row: Direct Phone & LINE Quick Contacts */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {/* 📞 Phone */}
                  <a
                    href={`tel:${phoneRaw}`}
                    className="flex items-center justify-center gap-1 px-2 py-1 sm:py-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white font-semibold text-[11px] sm:text-xs border border-white/20 backdrop-blur-md transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">โทร: {phone}</span>
                  </a>

                  {/* 💬 LINE */}
                  <a
                    href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 px-2 py-1 sm:py-1.5 rounded-md bg-[#06C755]/25 hover:bg-[#06C755]/35 text-emerald-300 font-bold text-[11px] sm:text-xs border border-[#06C755]/40 backdrop-blur-md transition-all"
                  >
                    <MessageCircle className="w-3 h-3 text-[#06C755] shrink-0" />
                    <span className="truncate">LINE: {lineId}</span>
                  </a>
                </div>
              </div>
            </Movable>
          </div>
        </Movable>

        {/* 3. Mobile Action Buttons Bar (Mobile only - Placed cleanly below image so it doesn't block the graphic) */}
        <div className="sm:hidden w-full mt-2.5 px-1 flex flex-col gap-1.5">
          <div className="grid grid-cols-2 gap-2">
            <a
              href="#recruitment"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white font-bold text-xs shadow-md active:scale-95 text-center"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{heroCtaDriverText}</span>
            </a>
            <a
              href="#contact"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white text-slate-900 font-bold text-xs border border-slate-300 shadow-sm active:scale-95 text-center"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>ติดต่อเรา</span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>โทร: {phone}</span>
            </a>
            <a
              href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#06C755] text-white font-bold text-xs active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>LINE: {lineId}</span>
            </a>
          </div>
        </div>


      </div>
    </section>
  );
}

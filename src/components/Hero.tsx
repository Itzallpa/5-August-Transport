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
    <section id="home" className="relative w-full h-[calc(100dvh-64px)] sm:h-auto sm:min-h-[calc(100vh-72px)] bg-gradient-to-b from-slate-100 via-white to-slate-50 py-2 sm:py-3 px-2 sm:px-4 md:px-6 border-b border-slate-200 flex flex-col justify-between sm:justify-center items-center overflow-hidden">
      {/* Container calibrated to fit 100% within the viewport height without vertical scrolling */}
      <div className="max-w-[1720px] mx-auto w-full h-full sm:h-auto flex flex-col justify-between sm:justify-center items-center">
        {/* 1. Main Hero Banner Frame */}
        <Movable field="heroBannerCard" className="relative w-full sm:w-auto inline-block max-w-full flex-shrink-0">
          <div className="relative w-full sm:w-auto inline-block rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/60 border border-slate-200/90 bg-white ring-1 ring-slate-900/5 group">
            <a href="#recruitment" className="block cursor-pointer">
              <Image
                src={heroBackgroundImage}
                alt="5 August Transport x KEX Express Partner"
                width={3200}
                height={1312}
                priority
                unoptimized
                className="w-full sm:w-auto h-auto sm:max-h-[calc(100vh-165px)] md:max-h-[660px] max-w-full block select-none"
              />
            </a>

            {/* Admin Image Edit Button */}
            <ImageEditButton
              field="heroImageUrl"
              label="📷 เปลี่ยนรูปภาพหน้าปก"
              className="absolute top-3 right-3 z-30 pointer-events-auto shadow-md"
            />

            {/* 2. Floating Action Buttons Console (Desktop only - Moved higher and enlarged as marked by user) */}
            <Movable field="heroCtaGroup" className="hidden sm:block absolute bottom-6 sm:bottom-10 md:bottom-14 lg:bottom-16 right-3 sm:right-5 md:right-8 lg:right-10 z-20 pointer-events-auto">
              <div className="bg-black/75 backdrop-blur-md p-2 sm:p-3 md:p-3.5 rounded-xl sm:rounded-2xl border border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.75)] w-auto max-w-[360px] sm:max-w-[420px] md:max-w-[470px] flex flex-col gap-1.5 sm:gap-2">
                {/* Top Row: Primary Actions */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
                  {/* 🔴 Apply Now */}
                  <Movable field="heroCtaDriverBtn" className="block">
                    <a
                      href="#recruitment"
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#8E0000] text-white font-extrabold text-xs sm:text-sm md:text-base shadow-md shadow-red-900/40 transition-all hover:scale-[1.03] active:scale-[0.98] border border-red-500/40 text-center"
                    >
                      <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white shrink-0" />
                      <span className="truncate">
                        <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform />
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 hidden sm:inline" />
                    </a>
                  </Movable>

                  {/* ⚪ Contact Us */}
                  <Movable field="heroContactBtn" className="block">
                    <a
                      href="#contact"
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm md:text-base border border-white/60 shadow-md transition-all hover:scale-[1.03] active:scale-[0.98] text-center"
                    >
                      <PhoneCall className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-[#D32F2F] shrink-0" />
                      <span className="truncate">ติดต่อเรา</span>
                    </a>
                  </Movable>
                </div>

                {/* Bottom Row: Direct Phone & LINE Quick Contacts */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
                  {/* 📞 Phone */}
                  <a
                    href={`tel:${phoneRaw}`}
                    className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-black/60 hover:bg-black/80 text-white font-bold text-xs sm:text-xs md:text-sm border border-white/20 backdrop-blur-md transition-all hover:scale-[1.02]"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">โทร: {phone}</span>
                  </a>

                  {/* 💬 LINE */}
                  <a
                    href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#06C755]/30 hover:bg-[#06C755]/45 text-emerald-300 font-bold text-xs sm:text-xs md:text-sm border border-[#06C755]/40 backdrop-blur-md transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#06C755] shrink-0" />
                    <span className="truncate">LINE: {lineId}</span>
                  </a>
                </div>
              </div>
            </Movable>
          </div>
        </Movable>

        {/* 3. Mobile Middle Highlights Card (Fills mobile viewport elegantly so it doesn't look empty or cut off) */}
        <div className="sm:hidden w-full my-auto px-2 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/90 shadow-sm flex flex-col gap-1.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#D32F2F] font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-ping shrink-0" />
            <span>เปิดรับสมัคร Partner รถร่วมขนส่ง (Linehaul)</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            ร่วมให้บริการ KEX Express สายงานวิ่งประจำและเสริมทั่วประเทศ
          </p>
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">4W ตู้ทึบ</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">4WJ จัมโบ้</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">6W ตู้ทึบ</span>
          </div>
        </div>

        {/* 4. Mobile Bottom Action Buttons Console (Fits mobile screen base without peeking next section) */}
        <div className="sm:hidden w-full flex-shrink-0 flex flex-col gap-1.5 pb-2">
          {/* 🔴 Primary Apply Button */}
          <a
            href="#recruitment"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white font-extrabold text-sm shadow-md shadow-red-900/30 active:scale-95 text-center"
          >
            <Truck className="w-4 h-4 text-white" />
            <span>{heroCtaDriverText} (คลิกสมัครทันที)</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Quick Contact Buttons Row */}
          <div className="grid grid-cols-3 gap-1.5">
            <a
              href="#contact"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-white text-slate-900 font-bold text-xs border border-slate-300 shadow-sm active:scale-95 text-center"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>ติดต่อเรา</span>
            </a>
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-900 text-white font-bold text-xs active:scale-95 text-center"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>โทรด่วน</span>
            </a>
            <a
              href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#06C755] text-white font-bold text-xs active:scale-95 text-center"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white" />
              <span>LINE</span>
            </a>
          </div>
        </div>


      </div>
    </section>
  );
}

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
    <section id="home" className="relative w-full bg-[#0a0b0e] py-3 sm:py-5 px-2 sm:px-4 flex flex-col items-center justify-center overflow-hidden border-b border-zinc-900">
      {/* Ambient background glow matching the banner colors */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src={heroBackgroundImage}
          alt="Ambient Background Glow"
          fill
          priority
          unoptimized
          className="object-cover blur-3xl opacity-25 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0e]/85 via-[#0a0b0e]/40 to-[#0a0b0e]" />
      </div>

      {/* Hero Banner Container - Fits viewport height comfortably ("พอดีๆ") */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <Movable field="heroBannerCard" className="relative inline-block max-w-full">
          <div className="relative inline-block rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] border border-white/15 bg-black/90 group">
            <Image
              src={heroBackgroundImage}
              alt="5 August Transport x KEX Express Partner"
              width={1024}
              height={687}
              priority
              unoptimized
              className="w-auto h-auto max-w-full max-h-[75vh] sm:max-h-[78vh] object-contain block mx-auto select-none"
            />

            {/* Admin Image Edit Button */}
            <ImageEditButton
              field="heroImageUrl"
              label="📷 เปลี่ยนรูปภาพหน้าปก"
              className="absolute top-3 right-3 z-30 pointer-events-auto shadow-md"
            />

            {/* Floating Action Buttons docked in front of the trucks ("แปะไว้หน้ารถ") */}
            <Movable field="heroCtaGroup" className="absolute bottom-2.5 sm:bottom-4 md:bottom-5 right-2 sm:right-4 md:right-5 z-20 pointer-events-auto">
              <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2.5 bg-black/80 sm:bg-black/65 backdrop-blur-xl p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border border-white/25 shadow-[0_12px_35px_rgba(0,0,0,0.85)] max-w-[95vw] sm:max-w-xl">
                {/* Primary Action: Apply Now */}
                <Movable field="heroCtaDriverBtn" className="inline-block">
                  <a
                    href="#recruitment"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#E53935] hover:to-[#C62828] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-950/60 transition-all hover:scale-[1.03] active:scale-[0.98] border border-red-500/40"
                  >
                    <Truck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white shrink-0" />
                    <span>
                      <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform /> (Apply Now)
                    </span>
                    <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 ml-0.5 shrink-0" />
                  </a>
                </Movable>

                {/* Secondary Action: Contact Us */}
                <Movable field="heroContactBtn" className="inline-block">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all hover:border-white/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <PhoneCall className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-red-500 shrink-0" />
                    <span>ติดต่อเรา (Contact Us)</span>
                  </a>
                </Movable>

                {/* Direct Phone Quick Link */}
                <a
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition-all hover:text-white"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>โทรด่วน: {phone}</span>
                </a>

                {/* LINE Quick Link */}
                <a
                  href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#06C755]/20 hover:bg-[#06C755]/30 text-emerald-400 font-semibold text-xs sm:text-sm border border-[#06C755]/40 backdrop-blur-md transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#06C755]" />
                  <span>LINE: {lineId}</span>
                </a>
              </div>
            </Movable>
          </div>
        </Movable>

        {/* Reassurance Strip */}
        <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>ประกันภัยสินค้าทุกเที่ยว 100%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>GPS ติดตามสถานะเรียลไทม์ 24 ชม.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>พันธมิตรเครือข่าย KEX Express</span>
          </div>
        </div>
      </div>
    </section>
  );
}

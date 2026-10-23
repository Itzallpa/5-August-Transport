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
    <section id="home" className="relative w-full bg-[#0a0b0e] pt-4 sm:pt-6 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 border-b border-zinc-900 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0e]/80 via-[#0a0b0e]/30 to-[#0a0b0e]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full flex flex-col items-center">
        {/* 1. Fully Fitted Heroic Banner (Expands across wide screens, perfectly proportional, 100% crystal sharp) */}
        <Movable field="heroBannerCard" className="w-full">
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] border border-white/15 bg-black/80 ring-1 ring-white/10 group">
            <Image
              src={heroBackgroundImage}
              alt="5 August Transport x KEX Express Partner"
              width={1024}
              height={687}
              priority
              unoptimized
              className="w-full h-auto block"
            />
            {/* Admin Image Edit Button */}
            <ImageEditButton
              field="heroImageUrl"
              label="📷 เปลี่ยนรูปภาพหน้าปก"
              className="absolute bottom-4 right-4 z-30 pointer-events-auto"
            />
          </div>
        </Movable>

        {/* 2. Clean CTA Action Bar: Apply Now, Contact Us, Direct Phone & LINE */}
        <Movable field="heroCtaGroup" className="w-full">
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
            {/* Primary Action: Apply Now */}
            <Movable field="heroCtaDriverBtn" className="inline-block">
              <a
                href="#recruitment"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#E53935] hover:to-[#C62828] text-white font-bold text-base sm:text-lg shadow-xl shadow-red-950/60 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] border border-red-500/40"
              >
                <Truck className="w-5 h-5 text-white shrink-0" />
                <span>
                  <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform /> (Apply Now)
                </span>
                <ArrowRight className="w-5 h-5 ml-0.5 shrink-0" />
              </a>
            </Movable>

            {/* Secondary Action: Contact Us */}
            <Movable field="heroContactBtn" className="inline-block">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-base border border-white/20 backdrop-blur-md transition-all shadow-lg hover:border-white/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <PhoneCall className="w-5 h-5 text-red-500 shrink-0" />
                <span>ติดต่อเรา (Contact Us)</span>
              </a>
            </Movable>

            {/* Direct Phone Quick Link */}
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-4 rounded-xl bg-zinc-900/70 hover:bg-zinc-800 text-zinc-100 font-semibold text-sm sm:text-base border border-white/15 backdrop-blur-md transition-all hover:text-white hover:border-white/30"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>โทรด่วน: {phone}</span>
            </a>

            {/* LINE Quick Link */}
            <a
              href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-4 rounded-xl bg-[#06C755]/15 hover:bg-[#06C755]/25 text-emerald-400 font-semibold text-sm sm:text-base border border-[#06C755]/30 backdrop-blur-md transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#06C755]" />
              <span>LINE: {lineId}</span>
            </a>
          </div>
        </Movable>

        {/* 3. Subtle Trust Reassurance Strip */}
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ประกันภัยสินค้าทุกเที่ยว 100%</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>GPS ติดตามสถานะเรียลไทม์ 24 ชม.</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-red-500 shrink-0" />
            <span>พันธมิตรเครือข่าย KEX Express</span>
          </div>
        </div>
      </div>
    </section>
  );
}

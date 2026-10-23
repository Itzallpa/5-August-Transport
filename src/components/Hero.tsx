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
    <section id="home" className="relative w-full bg-black p-0 m-0 overflow-hidden">
      {/* 1. Full-Bleed Edge-to-Edge Banner (Zero black side borders, 100% natural resolution) */}
      <div className="relative w-full">
        <Image
          src={heroBackgroundImage}
          alt="5 August Transport x KEX Express Partner"
          width={1024}
          height={687}
          priority
          unoptimized
          sizes="100vw"
          className="w-full h-auto block select-none"
        />

        {/* Admin Image Edit Button */}
        <ImageEditButton
          field="heroImageUrl"
          label="📷 เปลี่ยนรูปภาพหน้าปก"
          className="absolute top-4 right-4 z-30 pointer-events-auto shadow-lg"
        />

        {/* 2. Floating Action Buttons Docked Directly in Front of the Trucks ("แปะไว้หน้ารถ") */}
        <Movable field="heroCtaGroup" className="absolute bottom-3 sm:bottom-6 md:bottom-8 lg:bottom-10 right-2 sm:right-6 md:right-10 z-20 pointer-events-auto">
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 bg-black/75 sm:bg-black/60 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-white/25 shadow-[0_15px_40px_rgba(0,0,0,0.8)] max-w-full sm:max-w-xl">
            {/* Primary Action: Apply Now */}
            <Movable field="heroCtaDriverBtn" className="inline-block">
              <a
                href="#recruitment"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#E53935] hover:to-[#C62828] text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950/60 transition-all hover:scale-[1.03] active:scale-[0.98] border border-red-500/40"
              >
                <Truck className="w-4 h-4 text-white shrink-0" />
                <span>
                  <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform /> (Apply Now)
                </span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
              </a>
            </Movable>

            {/* Secondary Action: Contact Us */}
            <Movable field="heroContactBtn" className="inline-block">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all hover:border-white/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>ติดต่อเรา (Contact Us)</span>
              </a>
            </Movable>

            {/* Direct Phone Quick Link */}
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition-all hover:text-white"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>โทรด่วน: {phone}</span>
            </a>

            {/* LINE Quick Link */}
            <a
              href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-[#06C755]/20 hover:bg-[#06C755]/30 text-emerald-400 font-semibold text-xs sm:text-sm border border-[#06C755]/40 backdrop-blur-md transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#06C755]" />
              <span>LINE: {lineId}</span>
            </a>
          </div>
        </Movable>
      </div>

      {/* 3. Subtle Trust Reassurance Strip Underneath */}
      <div className="w-full bg-[#0a0b0e] py-3 px-4 border-t border-zinc-900/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-zinc-400">
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
    </section>
  );
}

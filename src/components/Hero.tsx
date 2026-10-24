import Image from "next/image";
import { Truck, ArrowRight, PhoneCall, MessageCircle, Clock, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { Editable, ImageEditButton, Movable } from "@/components/editor/EditorContext";

export default function Hero({ content }: { content?: Partial<SiteContentData> }) {
  const heroBadge = content?.heroBadge || "แพลตฟอร์มการขนส่งและกระจายสินค้ามาตรฐานสากล • ครอบคลุมทั่วประเทศ";
  const heroHeading = content?.heroHeading || "บริการขนส่งสินค้าทั่วประเทศ";
  const heroHeadingHighlight = content?.heroHeadingHighlight || "รวดเร็ว ปลอดภัย ตรงเวลา ทุกเส้นทาง";
  const heroSubheading =
    content?.heroSubheading ||
    "5 August Transport ผู้ให้บริการขนส่งสินค้าและกระจายสินค้าครบวงจร กองรถมาตรฐานกว่า 200 คัน 7 ประเภท พร้อมระบบติดตามสถานะ GPS Real-time ตลอด 24 ชั่วโมง";
  const heroCtaDriverText = content?.heroCtaDriverText || "สมัครขับรถร่วมกับเรา";
  const phone = content?.phone || "084-326-3546";
  const phoneRaw = content?.phoneRaw || "0843263546";
  const lineId = content?.lineId && content.lineId !== "0843263546" ? content.lineId : "@486eyver";

  // Background Image (CMS upload or fallback cargo transport image)
  const heroBackgroundImage = content?.heroImageUrl || "/images/thai_transport_hero.jpg";

  // 3 Feature Cards Data (Figma Template Signature)
  const card1Title = content?.heroStat1Label || "ส่งมอบตรงเวลาทุกเที่ยววิ่ง";
  const card1Desc = content?.heroStat1Value || "บริหารเส้นทางอย่างแม่นยำ ตรงตามเวลานัดหมาย มีรอบวิ่งสม่ำเสมอทุกวัน";
  const card2Title = content?.heroStat2Label || "ปลอดภัย & มีประกันภัยสินค้า";
  const card2Desc = content?.heroStat2Value || "ตรวจสภาพรถทุกเที่ยวก่อนออกวิ่ง พร้อมประกันภัยคุ้มครองสินค้าสูงสุด";
  const card3Title = content?.heroStat3Label || "เครือข่ายครอบคลุม 77 จังหวัด";
  const card3Desc = content?.heroStat3Value || "กองรถ 7 ประเภทกว่า 200+ คัน พร้อมระบบ GPS ติดตาม 24 ชม.";

  return (
    <section id="home" className="relative w-full bg-slate-900 text-white overflow-visible">
      {/* 1. Full-Width Hero Canvas with Background Image */}
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Crisp Cinematic Tint */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBackgroundImage}
            alt="5 August Transport Cargo Logistics"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center select-none"
          />
          {/* Gradients tailored for the Red/White corporate theme: deep dark vignette to let white/red text pop */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-950/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />
        </div>

        {/* Admin Edit Image Button */}
        <ImageEditButton
          field="heroImageUrl"
          label="📷 เปลี่ยนรูปภาพหน้าปก Hero"
          className="absolute top-5 right-5 z-40 pointer-events-auto shadow-lg"
        />

        {/* Main Hero Copy Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
          <div className="max-w-3xl space-y-6 text-center lg:text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {/* Top Pill Badge */}
            <Movable field="heroBadgeBox" className="inline-block">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/25 border border-red-500/40 text-red-300 text-xs sm:text-sm font-bold tracking-wide backdrop-blur-md shadow-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <Editable field="heroBadge" value={heroBadge} noTransform />
              </div>
            </Movable>

            {/* Main Headline */}
            <Movable field="heroHeadingBox" className="block">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                <Editable field="heroHeading" value={heroHeading} noTransform /> <br />
                <span className="text-[#D32F2F] bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-rose-400">
                  <Editable field="heroHeadingHighlight" value={heroHeadingHighlight} noTransform />
                </span>
              </h1>
            </Movable>

            {/* Sub-slogan / Description */}
            <Movable field="heroSubheadingBox" className="block">
              <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow-sm">
                <Editable field="heroSubheading" value={heroSubheading} multiline noTransform />
              </p>
            </Movable>

            {/* Call To Action Buttons Row */}
            <Movable field="heroCtaGroup" className="block pt-2">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                {/* 🔴 Primary Action: Request Quote / Calculate */}
                <a
                  href="#quote"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#8E0000] text-white font-black text-sm sm:text-base shadow-xl shadow-red-950/40 transition-all hover:scale-[1.03] active:scale-[0.98] border border-red-400/40"
                >
                  <Truck className="w-5 h-5 text-white" />
                  <span>ขอใบเสนอราคา / คำนวณค่าส่ง</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </a>

                {/* ⚪ Secondary Action: Driver Recruitment */}
                <a
                  href="#recruitment"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-extrabold text-sm sm:text-base border border-white/60 shadow-lg backdrop-blur-md transition-all hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-[#D32F2F]" />
                  <span>
                    <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform />
                  </span>
                </a>
              </div>
            </Movable>

            {/* Direct Quick Hotline Contacts */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs sm:text-sm text-slate-300">
              <a
                href={`tel:${phoneRaw}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-sm transition-colors text-white"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>โทรด่วน: {phone}</span>
              </a>

              <a
                href={`https://line.me/R/ti/p/${lineId.startsWith("@") ? lineId : `@${lineId}`}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#06C755]/20 hover:bg-[#06C755]/35 border border-[#06C755]/40 backdrop-blur-sm transition-colors text-emerald-300 font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#06C755]" />
                <span>LINE: {lineId}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three Overlapping Feature Cards (Signature element of the Figma template!) */}
      <div className="relative z-20 -mb-16 sm:-mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: On-Time Delivery */}
          <Movable field="heroCard1" className="block">
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-900/15 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#D32F2F] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  มาตรฐาน 99.8%
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1.5 group-hover:text-[#D32F2F] transition-colors">
                <Editable field="heroStat1Label" value={card1Title} noTransform />
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <Editable field="heroStat1Value" value={card1Desc} multiline noTransform />
              </p>
            </div>
          </Movable>

          {/* Card 2: Safe & Insured */}
          <Movable field="heroCard2" className="block">
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-900/15 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#D32F2F] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  ประกันสินค้า 100%
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1.5 group-hover:text-[#D32F2F] transition-colors">
                <Editable field="heroStat2Label" value={card2Title} noTransform />
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <Editable field="heroStat2Value" value={card2Desc} multiline noTransform />
              </p>
            </div>
          </Movable>

          {/* Card 3: Nationwide Coverage (Highlight Red Card in the Red/White Theme!) */}
          <Movable field="heroCard3" className="block">
            <div className="bg-gradient-to-br from-[#D32F2F] via-[#C62828] to-[#B71C1C] rounded-2xl p-6 sm:p-7 text-white shadow-xl shadow-red-900/35 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  กองรถ 200+ คัน
                </span>
              </div>
              <h3 className="text-lg font-black text-white mb-1.5">
                <Editable field="heroStat3Label" value={card3Title} noTransform />
              </h3>
              <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-normal">
                <Editable field="heroStat3Value" value={card3Desc} multiline noTransform />
              </p>
            </div>
          </Movable>
        </div>
      </div>
    </section>
  );
}

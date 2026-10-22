import Image from "next/image";
import { Truck, ArrowRight, ShieldCheck, MapPin, Clock, Award, PhoneCall, MessageSquare } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";

export default function Hero({ content }: { content?: Partial<SiteContentData> }) {
  const heroBadge = content?.heroBadge || "ครอบคลุมทั่วประเทศ • รวดเร็ว • ปลอดภัย • ตรงเวลา • คุ้มค่า";
  const heroHeading = content?.heroHeading || "ทุกเส้นทาง";
  const heroHeadingHighlight = content?.heroHeadingHighlight || "เราพร้อมส่งต่อความมั่นใจ";
  const heroSubheading = content?.heroSubheading || COMPANY_INFO.subSlogan;
  const trustedTagline = content?.trustedTagline || COMPANY_INFO.trustedTagline;
  const heroCtaDriverText = content?.heroCtaDriverText || "สมัครขับรถร่วมกับเรา";
  const heroCtaFleetText = content?.heroCtaFleetText || "ดูประเภทรถขนส่ง (7 ประเภท)";
  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const lineId = content?.lineId || COMPANY_INFO.lineId;

  // Background Image (from CMS upload or fallback hero image)
  const heroBackgroundImage = content?.heroImageUrl || "/images/hero.jpg";

  // Dedicated Fleet Showcase Photo
  const fleetShowcaseImage = "/images/thai_transport_hero.jpg";

  // Stats
  const stat1Label = content?.heroStat1Label || "ตรงต่อเวลาเฉลี่ย";
  const stat1Val = content?.heroStat1Value || "99.8%";
  const stat2Label = content?.heroStat2Label || "กองรถพร้อมให้บริการ";
  const stat2Val = content?.heroStat2Value || "200+";
  const stat3Label = content?.heroStat3Label || "เส้นทางบริการ";
  const stat3Val = content?.heroStat3Value || "77";
  const stat4Label = content?.heroStat4Label || "เปิดรับสมัครคนขับ";
  const stat4Val = content?.heroStat4Value || "ทุกวัน";

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 sm:py-24 border-b border-slate-800 text-white">
      {/* 1. Cinematic Full Background Image with Multi-layer Logistics Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgroundImage}
          alt="5 August Transport Logistics Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark Gradient Overlay for Maximum Legibility & Punch */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/80" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        {/* Subtle Brand Red Glow Accent */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Main Hero Copy (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs sm:text-sm font-bold tracking-wide shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{heroBadge}</span>
            </div>

            {/* Slogan & Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {heroHeading} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-400">
                {heroHeadingHighlight}
              </span>
            </h1>

            {/* Sub-slogan */}
            <p className="text-base sm:text-lg text-slate-300 font-normal max-w-xl leading-relaxed">
              {heroSubheading}
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-2.5 text-xs sm:text-sm text-slate-400 font-semibold">
              <span className="w-6 h-[2px] bg-red-500 inline-block" />
              <span className="text-slate-300 font-bold tracking-widest uppercase text-xs">
                {trustedTagline}
              </span>
              <span className="w-6 h-[2px] bg-red-500 inline-block" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-3.5 pt-2">
              <a
                href="#recruitment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm sm:text-base shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Truck className="w-5 h-5" />
                <span>{heroCtaDriverText} (Apply Now)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <a
                href="#fleet"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all shadow-sm"
              >
                <span>{heroCtaFleetText}</span>
              </a>

              <a
                href={`tel:${phoneRaw}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 backdrop-blur-md transition-colors shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span>{phone}</span>
              </a>

              <a
                href={`https://line.me/ti/p/~${lineId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-sm shadow-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>LINE: @{lineId}</span>
              </a>
            </div>

            {/* Mini trust checklist */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ประกันภัยสินค้าทุกเที่ยว 100%</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>รายงานสถานะ GPS ตลอด 24 ชม.</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-red-400 shrink-0" />
                <span>พันธมิตรเครือข่ายชั้นนำ (KEX)</span>
              </div>
            </div>
          </div>

          {/* Right Floating Showcase Panel (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Real Fleet Photo in Clean Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900/90 group backdrop-blur-md">
              <div className="relative w-full h-56 sm:h-64">
                <Image
                  src={fleetShowcaseImage}
                  alt="5 August Transport Fleet Logistics"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Status Pill */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700/80 text-xs font-bold text-slate-200 shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ศูนย์ปฏิบัติการเดินรถ ONLINE</span>
              </div>
            </div>

            {/* 4 Stats Grid in Crisp Glassmorphism Card */}
            <div className="bg-slate-950/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-800/90 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-200">ศูนย์ประสานงานครอบคลุม 77 จังหวัด ทั่วประเทศ</span>
                </div>
                <span className="text-[11px] font-bold text-red-400 uppercase">24 Hours</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium block">{stat1Label}</span>
                  <div className="text-xl sm:text-2xl font-black text-red-400 mt-0.5">{stat1Val}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium block">{stat2Label}</span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{stat2Val}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium block">{stat3Label}</span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{stat3Val}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium block">{stat4Label}</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{stat4Val}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-xs text-slate-300 flex items-center justify-between">
                <span className="font-medium">ต้องการขอใบเสนอราคาด่วน?</span>
                <a
                  href={`tel:${phoneRaw}`}
                  className="font-bold text-red-400 hover:text-red-300 hover:underline"
                >
                  โทรสายด่วนทันที →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ticker Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-red-400">{stat1Val}</div>
            <p className="text-xs text-slate-400 font-medium">{stat1Label}</p>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-white">{stat2Val}</div>
            <p className="text-xs text-slate-400 font-medium">{stat2Label}</p>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-white">{stat3Val}</div>
            <p className="text-xs text-slate-400 font-medium">{stat3Label}</p>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">24 ชม.</div>
            <p className="text-xs text-slate-400 font-medium">GPS ติดตามเรียลไทม์</p>
          </div>
        </div>
      </div>
    </section>
  );
}

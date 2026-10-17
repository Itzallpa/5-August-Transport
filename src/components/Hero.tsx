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

  // Real Fleet Banner Image
  const heroBannerImage = "/images/thai_transport_hero.jpg";

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
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-zinc-50/70 to-white py-14 sm:py-20 border-b border-zinc-200">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Main Hero Copy (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#D32F2F] text-xs sm:text-sm font-bold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-pulse" />
              <span>{heroBadge}</span>
            </div>

            {/* Slogan & Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 leading-tight tracking-tight">
              {heroHeading} <br />
              <span className="text-[#D32F2F]">
                {heroHeadingHighlight}
              </span>
            </h1>

            {/* Sub-slogan */}
            <p className="text-base sm:text-lg text-zinc-600 font-normal max-w-xl leading-relaxed">
              {heroSubheading}
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-2.5 text-xs sm:text-sm text-zinc-400 font-semibold">
              <span className="w-6 h-[2px] bg-[#D32F2F] inline-block" />
              <span className="text-zinc-700 font-bold tracking-widest uppercase text-xs">
                {trustedTagline}
              </span>
              <span className="w-6 h-[2px] bg-[#D32F2F] inline-block" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-3.5 pt-2">
              <a
                href="#recruitment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm sm:text-base shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Truck className="w-5 h-5" />
                <span>{heroCtaDriverText} (Apply Now)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <a
                href="#fleet"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-sm sm:text-base border-2 border-zinc-200 hover:border-zinc-300 transition-all shadow-sm"
              >
                <span>{heroCtaFleetText}</span>
              </a>

              <a
                href={`tel:${phoneRaw}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-sm border border-zinc-200 transition-colors shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-[#D32F2F]" />
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
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs sm:text-sm text-zinc-600">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ประกันภัยสินค้าทุกเที่ยว 100%</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>รายงานสถานะ GPS ตลอด 24 ชม.</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <span>พันธมิตรเครือข่ายชั้นนำ (KEX)</span>
              </div>
            </div>
          </div>

          {/* Right Floating Showcase Panel (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Real Fleet Photo in Clean Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-zinc-100 group">
              <div className="relative w-full h-56 sm:h-64">
                <Image
                  src={heroBannerImage}
                  alt="5 August Transport Fleet Logistics"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Status Pill */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-zinc-200 text-xs font-bold text-zinc-800 shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ศูนย์ปฏิบัติการเดินรถ ONLINE</span>
              </div>
            </div>

            {/* 4 Stats Grid in Crisp Clean White Card */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D32F2F]" />
                  <span className="text-xs font-bold text-zinc-800">ศูนย์ประสานงานครอบคลุม 77 จังหวัด ทั่วประเทศ</span>
                </div>
                <span className="text-[11px] font-bold text-[#D32F2F] uppercase">24 Hours</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[11px] text-zinc-500 font-medium block">{stat1Label}</span>
                  <div className="text-xl sm:text-2xl font-black text-[#D32F2F] mt-0.5">{stat1Val}</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[11px] text-zinc-500 font-medium block">{stat2Label}</span>
                  <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-0.5">{stat2Val}</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[11px] text-zinc-500 font-medium block">{stat3Label}</span>
                  <div className="text-xl sm:text-2xl font-black text-zinc-900 mt-0.5">{stat3Val}</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[11px] text-zinc-500 font-medium block">{stat4Label}</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">{stat4Val}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-50/70 border border-red-100 text-xs text-zinc-700 flex items-center justify-between">
                <span className="font-medium">ต้องการขอใบเสนอราคาด่วน?</span>
                <a
                  href={`tel:${phoneRaw}`}
                  className="font-bold text-[#D32F2F] hover:underline"
                >
                  โทรสายด่วนทันที →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ticker Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-zinc-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-[#D32F2F]">{stat1Val}</div>
            <p className="text-xs text-zinc-500 font-medium">{stat1Label}</p>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-zinc-900">{stat2Val}</div>
            <p className="text-xs text-zinc-500 font-medium">{stat2Label}</p>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-zinc-900">{stat3Val}</div>
            <p className="text-xs text-zinc-500 font-medium">{stat3Label}</p>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-[#D32F2F]">24 ชม.</div>
            <p className="text-xs text-zinc-500 font-medium">GPS ติดตามเรียลไทม์</p>
          </div>
        </div>
      </div>
    </section>
  );
}

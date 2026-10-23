import Image from "next/image";
import { Truck, ArrowRight, ShieldCheck, MapPin, Clock, Award, PhoneCall, MessageSquare } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { Editable, ImageEditButton, Movable } from "@/components/editor/EditorContext";

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
  const heroBackgroundImage = content?.heroImageUrl || "/images/hero-cover.jpg";

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
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 sm:py-24 border-b border-zinc-900 bg-black text-white">
      {/* 1. Full Background Image in its TRUE Original Colors (No heavy dark wash / No blue filter) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgroundImage}
          alt="5 August Transport Logistics Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft natural gradient on the left side only for text legibility, preserving true image colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent pointer-events-none" />
        <ImageEditButton field="heroImageUrl" label="📷 อัปโหลดรูปภาพพื้นหลัง Hero" className="absolute bottom-6 right-6 z-30" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Main Hero Copy (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {/* Top Badge (Whole pill moves together) */}
            <Movable field="heroBadge" className="inline-block rounded-full">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 text-red-400 text-xs sm:text-sm font-bold tracking-wide shadow-md backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <Editable field="heroBadge" value={heroBadge} noTransform />
              </div>
            </Movable>

            {/* Slogan & Headline */}
            <Movable field="heroHeadingBox" className="block">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                <Editable field="heroHeading" value={heroHeading} /> <br />
                <span className="text-[#D32F2F]">
                  <Editable field="heroHeadingHighlight" value={heroHeadingHighlight} />
                </span>
              </h1>
            </Movable>

            {/* Sub-slogan */}
            <Movable field="heroSubheadingBox" className="block">
              <p className="text-base sm:text-lg text-zinc-100 font-normal max-w-xl leading-relaxed drop-shadow-sm">
                <Editable field="heroSubheading" value={heroSubheading} as="span" multiline />
              </p>
            </Movable>

            <Movable field="trustedTaglineBox" className="inline-block">
              <div className="flex items-center justify-center lg:justify-start gap-2.5 text-xs sm:text-sm text-zinc-300 font-semibold">
                <span className="w-6 h-[2px] bg-[#D32F2F] inline-block" />
                <span className="text-zinc-100 font-bold tracking-widest uppercase text-xs">
                  <Editable field="trustedTagline" value={trustedTagline} />
                </span>
                <span className="w-6 h-[2px] bg-[#D32F2F] inline-block" />
              </div>
            </Movable>

            {/* CTA Buttons - Simplified: Only Apply Now & Contact Us */}
            <Movable field="heroCtaGroup" className="block">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Movable field="heroCtaDriverBtn" className="inline-block">
                  <a
                    href="#recruitment"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm sm:text-base shadow-xl shadow-red-950/40 transition-all hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <Truck className="w-5 h-5" />
                    <span>
                      <Editable field="heroCtaDriverText" value={heroCtaDriverText} noTransform /> (Apply Now)
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </Movable>

                <Movable field="heroContactBtn" className="inline-block">
                  <a
                    href="#contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black/60 hover:bg-black/80 text-white font-bold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all shadow-md hover:border-white/40"
                  >
                    <PhoneCall className="w-4 h-4 text-red-500" />
                    <span>ติดต่อเรา (Contact Us)</span>
                  </a>
                </Movable>
              </div>
            </Movable>

            {/* Mini trust checklist */}
            <Movable field="heroTrustChecklist" className="block">
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs sm:text-sm text-zinc-100">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ประกันภัยสินค้าทุกเที่ยว 100%</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>รายงานสถานะ GPS ตลอด 24 ชม.</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 text-red-500 shrink-0" />
                  <span>พันธมิตรเครือข่ายชั้นนำ (KEX)</span>
                </div>
              </div>
            </Movable>
          </div>

          {/* Right Floating Showcase Panel (5 cols on lg) - Clean Stats Card without side image */}
          <Movable field="heroStatsCard" className="lg:col-span-5 space-y-4">
            {/* 4 Stats Grid in Frosted Glassmorphism Card */}
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/15 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D32F2F]" />
                  <span className="text-xs font-bold text-zinc-100">ศูนย์ประสานงานครอบคลุม 77 จังหวัด ทั่วประเทศ</span>
                </div>
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">24 Hours</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <Movable field="heroStatBox1" className="p-3.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] text-zinc-300 font-medium block">
                    <Editable field="heroStat1Label" value={stat1Label} noTransform />
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-red-500 mt-0.5">
                    <Editable field="heroStat1Value" value={stat1Val} noTransform />
                  </div>
                </Movable>

                <Movable field="heroStatBox2" className="p-3.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] text-zinc-300 font-medium block">
                    <Editable field="heroStat2Label" value={stat2Label} noTransform />
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    <Editable field="heroStat2Value" value={stat2Val} noTransform />
                  </div>
                </Movable>

                <Movable field="heroStatBox3" className="p-3.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] text-zinc-300 font-medium block">
                    <Editable field="heroStat3Label" value={stat3Label} noTransform />
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    <Editable field="heroStat3Value" value={stat3Val} noTransform />
                  </div>
                </Movable>

                <Movable field="heroStatBox4" className="p-3.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] text-zinc-300 font-medium block">
                    <Editable field="heroStat4Label" value={stat4Label} noTransform />
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                    <Editable field="heroStat4Value" value={stat4Val} noTransform />
                  </div>
                </Movable>
              </div>

              <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/30 text-xs text-zinc-200 flex items-center justify-between">
                <span className="font-medium">ต้องการขอใบเสนอราคาด่วน?</span>
                <a
                  href={`tel:${phoneRaw}`}
                  className="font-bold text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
                >
                  <span>โทรสายด่วนทันที</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </Movable>
        </div>

        {/* Bottom Ticker Bar */}
        <Movable field="heroTickerBar" className="block">
          <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-red-500">{stat1Val}</div>
            <p className="text-xs text-zinc-300 font-medium">{stat1Label}</p>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-white">{stat2Val}</div>
            <p className="text-xs text-zinc-300 font-medium">{stat2Label}</p>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-white">{stat3Val}</div>
            <p className="text-xs text-zinc-300 font-medium">{stat3Label}</p>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">24 ชม.</div>
            <p className="text-xs text-zinc-300 font-medium">GPS ติดตามเรียลไทม์</p>
          </div>
        </div>
      </Movable>
      </div>
    </section>
  );
}

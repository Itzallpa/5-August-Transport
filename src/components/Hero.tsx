import Image from "next/image";
import { Truck, ArrowRight, ShieldCheck, MapPin, Clock, Award, PhoneCall } from "lucide-react";
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
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20">
      {/* Background Image with Dark Logistics Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="5 August Transport Fleet Logistics"
          fill
          priority
          className="object-cover object-center opacity-40 scale-105 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>{heroBadge}</span>
            </div>

            {/* Slogan & Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {heroHeading} <br />
              <span className="text-[#D32F2F]">
                {heroHeadingHighlight}
              </span>
            </h1>

            {/* Sub-slogan */}
            <p className="text-base sm:text-xl text-slate-200 font-light max-w-2xl leading-relaxed">
              {heroSubheading}
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-300 font-medium">
              <span className="w-6 h-[1px] bg-red-600 inline-block" />
              <span className="text-white font-semibold tracking-widest uppercase text-xs sm:text-sm">
                {trustedTagline}
              </span>
              <span className="w-6 h-[1px] bg-red-600 inline-block" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#recruitment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-base shadow-lg shadow-black/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Truck className="w-5 h-5" />
                <span>{heroCtaDriverText}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <a
                href="#fleet"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base border border-slate-700 hover:border-slate-500 transition-all backdrop-blur-md"
              >
                <span>{heroCtaFleetText}</span>
              </a>

              <a
                href={`tel:${phoneRaw}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/15 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-red-500" />
                <span>{phone}</span>
              </a>
            </div>

            {/* Mini trust checklist */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ประกันภัยสินค้าทุกเที่ยว</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>รายงานสถานะ GPS 24 ชม.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-red-400" />
                <span>พันธมิตรเครือข่ายชั้นนำ (KEX)</span>
              </div>
            </div>
          </div>

          {/* Right Floating Showcase Panel (4 cols on lg) - Flattened hierarchy without nested cards */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div>
                    <h2 className="text-white font-bold text-sm">ศูนย์ปฏิบัติการเดินรถ</h2>
                    <p className="text-xs text-slate-400">ควบคุมและกระจายงานทั่วประเทศ</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ONLINE
                </span>
              </div>

              {/* Stats grid using borders instead of nested cards */}
              <div className="grid grid-cols-2 gap-px bg-slate-800 rounded-xl overflow-hidden border border-slate-800">
                <div className="p-4 bg-slate-900">
                  <span className="text-xs text-slate-400">{stat1Label}</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{stat1Val}</div>
                  <span className="text-[10px] text-slate-500">มาตรฐานสากล</span>
                </div>
                <div className="p-4 bg-slate-900">
                  <span className="text-xs text-slate-400">{stat2Label}</span>
                  <div className="text-2xl font-black text-white mt-1">{stat2Val}</div>
                  <span className="text-[10px] text-slate-500">คันทั่วประเทศ</span>
                </div>
                <div className="p-4 bg-slate-900">
                  <span className="text-xs text-slate-400">{stat3Label}</span>
                  <div className="text-2xl font-black text-white mt-1">{stat3Val}</div>
                  <span className="text-[10px] text-slate-500">จังหวัดทั่วไทย</span>
                </div>
                <div className="p-4 bg-slate-900">
                  <span className="text-xs text-slate-400">{stat4Label}</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">{stat4Val}</div>
                  <span className="text-[10px] text-slate-500">มีงานประจำรองรับ</span>
                </div>
              </div>

              {/* Highlight callout with high-contrast text */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center justify-between">
                <span>ต้องการใบเสนอราคาขนส่งด่วน?</span>
                <a
                  href={`tel:${phoneRaw}`}
                  className="font-bold text-red-400 hover:text-red-300 underline underline-offset-2"
                >
                  โทรทันที
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ticker Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white">{stat1Val}</div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat1Label}</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-[#D32F2F]">{stat2Val}</div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat2Label}</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white">{stat3Val}</div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat3Label}</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">24/7</div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">ศูนย์ควบคุม GPS เรียลไทม์</p>
          </div>
        </div>
      </div>
    </section>
  );
}


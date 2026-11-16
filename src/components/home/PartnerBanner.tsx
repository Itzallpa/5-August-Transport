import Image from "next/image";
import {
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Check,
  ClipboardList,
  CalendarDays,
  Gavel,
  PackagePlus,
  Handshake,
} from "lucide-react";

/**
 * "เปิดรับสมัครทั้ง 4 ภาค" — 5 August × KEX Express partner recruitment banner.
 * Same information as the original poster, rebuilt in code: full-bleed photo, bold type,
 * sharp on every screen and readable on mobile.
 */

const TRUCKS = [
  { code: "4W", name: "รถกระบะตู้ทึบ 4 ล้อ", cbm: "4.5 – 6.6", weight: "1 – 1.5", size: "1.20–1.50 × 2.10–2.20 × 1.80–2.00" },
  { code: "4WJ", name: "รถ 4 ล้อจัมโบ้", cbm: "10.8", weight: "3", size: "1.80 × 3.00 × 2.00" },
  { code: "6W", name: "รถ 6 ล้อตู้ทึบ", cbm: "30", weight: "5", size: "2.30 × 7.20 × 2.30" },
];

const JOB_TYPES = [
  { icon: ClipboardList, en: "Standard Rate Table", th: "งานตามอัตราค่าบริการมาตรฐาน" },
  { icon: CalendarDays, en: "Monthly Truck", th: "งานแบบสัญญารายเดือน" },
  { icon: Gavel, en: "Bidding Truck", th: "งานประมูล / เสนอราคาแข่งขัน" },
  { icon: PackagePlus, en: "Adhoc Truck", th: "งานเสริมตามความต้องการเป็นครั้งคราว" },
];

const SUITABLE_FOR = [
  "บริษัทขนส่ง / เจ้าของรถ / ผู้ประกอบการร่วม",
  "มีรถพร้อมใช้งาน",
  "ต้องการเพิ่มงานให้ Fleet",
  "รองรับงานประจำและงานเสริม",
];

const REQUIRED_INFO = ["ประเภทรถ", "จำนวนรถ", "พื้นที่ให้บริการ", "เอกสารบริษัท / เอกสารรถ"];

export default function PartnerBanner({
  phone,
  phoneRaw,
  lineId,
  email,
}: {
  phone: string;
  phoneRaw: string;
  lineId: string;
  email: string;
}) {
  return (
    <article aria-labelledby="partner-banner-title" className="relative overflow-hidden rounded-md bg-ink text-white shadow-2xl shadow-ink/25">
      {/* ═════════════ HERO PANEL ═════════════ */}
      <div className="relative isolate">
        {/* Photo — full width on mobile, right half with a diagonal cut on desktop */}
        <div className="relative h-64 sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[46%] lg:[clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]">
          <Image
            src="/images/kex-fleet-photo.jpg"
            alt="รถ 4W, 4WJ และ 6W ของ 5 August Transport วิ่งงาน KEX Express ที่คลังสินค้า"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover object-[72%_70%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:from-ink/50" aria-hidden />
        </div>
        {/* Red + yellow edge along the diagonal */}
        <div
          aria-hidden
          className="hidden lg:block absolute inset-y-0 right-0 w-[46%] bg-brand [clip-path:polygon(16%_0,17.6%_0,1.6%_100%,0_100%)] -translate-x-3"
        />
        <div
          aria-hidden
          className="hidden lg:block absolute inset-y-0 right-0 w-[46%] bg-signal [clip-path:polygon(16%_0,16.6%_0,0.6%_100%,0_100%)] -translate-x-6"
        />

        {/* Left accent bar */}
        <div aria-hidden className="absolute left-0 top-0 h-full w-3 sm:w-4 bg-brand" />

        <div className="relative px-6 sm:px-12 lg:px-16 pt-8 sm:pt-10 pb-10 sm:pb-14 lg:w-[57%]">
          {/* Lockup */}
          <div className="inline-flex items-center gap-4 bg-white rounded-sm pl-4 pr-5 py-2.5 shadow-lg">
            <span className="relative h-11 w-28 sm:h-12 sm:w-32">
              <Image src="/images/logo.png" alt="5 August Transport" fill sizes="128px" className="object-contain" />
            </span>
            <span className="text-xl font-light text-muted" aria-hidden>×</span>
            <span className="flex flex-col items-center">
              <span className="relative h-7 w-[6.2rem] sm:h-8 sm:w-[7.1rem] rounded-[4px] overflow-hidden bg-[#FE4600]">
                <Image src="/images/kex-mark.png" alt="KEX" fill sizes="114px" className="object-contain" />
              </span>
              <span className="mt-0.5 text-[0.55rem] tracking-[0.4em] text-ink font-semibold">EXPRESS</span>
            </span>
          </div>

          <p className="mt-10 lg:mt-12 flex w-fit items-center gap-2 text-signal font-semibold tracking-wide">
            <span className="h-px w-10 bg-signal" aria-hidden />
            ร่วมให้บริการ KEX Express – Linehaul (LH)
          </p>
          <h2
            id="partner-banner-title"
            className="mt-5 font-bold tracking-tight leading-[1.02] text-[3.2rem] sm:text-[5rem] lg:text-[6rem]"
          >
            <span className="block">เปิดรับสมัคร</span>
            <span className="relative mt-3 inline-block">
              <span className="absolute inset-0 -inset-x-4 bg-brand -skew-x-[10deg] shadow-[0_18px_40px_-12px_rgba(193,18,31,0.8)]" aria-hidden />
              <span className="absolute -inset-x-4 bottom-0 h-1.5 bg-signal -skew-x-[10deg]" aria-hidden />
              <span className="relative px-1">ทั้ง 4 ภาค</span>
            </span>
          </h2>
          <p className="mt-8 text-xl sm:text-2xl font-semibold">
            ร่วมเป็น Partner ขนส่งกับ <span className="text-signal">5 August Transport</span>
          </p>
          <p className="mt-2 text-white/70 max-w-xl">
            สำหรับผู้ประกอบการขนส่งและเจ้าของรถที่ต้องการร่วมงานกับ 5 August Transport
          </p>

          {/* Vehicle plates */}
          <div className="mt-10 grid sm:grid-cols-3 gap-3">
            {TRUCKS.map((t) => (
              <div
                key={t.code}
                className="group relative overflow-hidden bg-white/[0.06] border border-white/15 hover:border-white/35 hover:bg-white/[0.1] transition-colors"
              >
                <div className="flex items-stretch">
                  <span className="bg-brand px-3.5 flex items-center font-mono text-2xl sm:text-3xl font-semibold tabular">
                    {t.code}
                  </span>
                  <span className="flex-1 px-3 py-3 text-[0.9rem] font-semibold leading-tight flex items-center whitespace-nowrap">{t.name}</span>
                </div>
                <dl className="px-3.5 py-3 border-t border-white/10 text-sm">
                  <div className="flex items-baseline justify-between gap-2 py-1.5 border-b border-white/10">
                    <dt className="text-white/60 text-xs">ความจุ</dt>
                    <dd className="font-semibold tabular whitespace-nowrap">
                      <span className="text-lg">{t.cbm}</span> <span className="text-white/70 font-normal">CBM</span>
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-2 py-1.5 border-b border-white/10">
                    <dt className="text-white/60 text-xs">น้ำหนักบรรทุก</dt>
                    <dd className="font-semibold tabular whitespace-nowrap">
                      <span className="text-lg">{t.weight}</span> <span className="text-white/70 font-normal">ตัน</span>
                    </dd>
                  </div>
                  <div className="pt-2">
                    <dt className="text-white/60 text-xs">ขนาดตู้ (ก × ย × ส)</dt>
                    <dd className="mt-0.5 text-[0.8125rem] tabular">{t.size}&nbsp;ม.</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>

        {/* Tagline over the photo */}
        <p className="hidden lg:block absolute top-10 right-12 text-right text-lg font-semibold italic leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          ร่วมขับเคลื่อน
          <br />
          โลจิสติกส์ไทย{" "}
          <span className="relative inline-block">
            ไปด้วยกัน
            <span className="absolute left-0 right-0 -bottom-1 h-[3px] bg-signal -skew-x-12" aria-hidden />
          </span>
        </p>

        {/* Contact card — sits on the photo on desktop, in flow on mobile */}
        <div className="px-6 sm:px-12 pb-10 lg:p-0 lg:absolute lg:right-12 lg:top-32 lg:w-[360px]">
          <div className="relative bg-brand p-6 sm:p-7 shadow-2xl shadow-black/40">
            <span className="absolute -top-3 left-6 bg-ink px-3 py-1 text-xs font-semibold tracking-wide text-signal">
              สนใจร่วมงาน ติดต่อทีมจัดหารถร่วม
            </span>
            <a href={`tel:${phoneRaw}`} className="group mt-2 flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-full bg-white text-brand flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" aria-hidden />
              </span>
              <span className="font-mono text-3xl sm:text-[2.1rem] font-semibold tabular tracking-tight">{phone}</span>
            </a>
            <div className="mt-5 pt-4 border-t border-white/25 space-y-2.5">
              <a
                href={`https://line.me/R/ti/p/${lineId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:underline underline-offset-4"
              >
                <span className="w-7 h-7 rounded-full bg-[#06C755] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" aria-hidden />
                </span>
                <span className="text-lg font-medium">{lineId}</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 hover:underline underline-offset-4 min-w-0">
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" aria-hidden />
                </span>
                <span className="text-base sm:text-lg font-medium break-all">{email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════ INFO BAND ═════════════ */}
      <div className="relative bg-ink-2 border-t border-white/10 grid lg:grid-cols-12">
        <section className="lg:col-span-6 px-6 sm:px-12 lg:px-16 py-9 border-b lg:border-b-0 lg:border-r border-white/10">
          <h3 className="flex items-center gap-3 text-lg font-semibold">
            <span className="h-5 w-1.5 bg-brand -skew-x-12" aria-hidden />
            รูปแบบงานที่รองรับ
          </h3>
          <ul className="mt-5 grid sm:grid-cols-2 gap-3">
            {JOB_TYPES.map(({ icon: Icon, en, th }) => (
              <li key={en} className="flex gap-3 bg-white/[0.04] border border-white/10 p-3.5">
                <span className="w-10 h-10 shrink-0 bg-brand flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold leading-tight">{en}</span>
                  <span className="block mt-1 text-sm text-white/65 leading-snug">{th}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-3 px-6 sm:px-12 lg:px-8 py-9 border-b lg:border-b-0 lg:border-r border-white/10">
          <h3 className="flex items-center gap-3 text-lg font-semibold">
            <span className="h-5 w-1.5 bg-brand -skew-x-12" aria-hidden />
            เหมาะสำหรับ
          </h3>
          <ul className="mt-5 space-y-3 text-[0.95rem]">
            {SUITABLE_FOR.map((s) => (
              <li key={s} className="flex gap-3">
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-brand flex items-center justify-center">
                  <Check className="w-3 h-3" strokeWidth={3.5} aria-hidden />
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-3 px-6 sm:px-12 lg:px-8 py-9">
          <h3 className="flex items-center gap-3 text-lg font-semibold">
            <span className="h-5 w-1.5 bg-brand -skew-x-12" aria-hidden />
            ข้อมูลเบื้องต้นสำหรับสมัคร
          </h3>
          <ul className="mt-5 space-y-3 text-[0.95rem]">
            {REQUIRED_INFO.map((s) => (
              <li key={s} className="flex gap-3">
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-brand flex items-center justify-center">
                  <Check className="w-3 h-3" strokeWidth={3.5} aria-hidden />
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ═════════════ PARTNER RIBBON ═════════════ */}
      <div className="relative overflow-hidden bg-signal text-ink">
        <div aria-hidden className="absolute inset-y-0 right-0 w-1/3 bg-[repeating-linear-gradient(-55deg,transparent_0_18px,rgba(22,19,15,0.06)_18px_36px)]" />
        <div className="relative px-6 sm:px-12 lg:px-16 py-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 shrink-0 bg-ink text-signal flex items-center justify-center -skew-x-6">
              <Handshake className="w-7 h-7 skew-x-6" aria-hidden />
            </span>
            <div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight">
                ร่วมเป็นพาร์ทเนอร์ขนส่งกับ <span className="text-brand-deep">5 August Transport</span>
              </p>
              <p className="mt-0.5 text-ink/75 font-medium">ขยายโอกาสทางธุรกิจ พร้อมรองรับงาน KEX Express – Linehaul</p>
            </div>
          </div>
          <a
            href="#recruitment"
            className="inline-flex items-center justify-center gap-2 h-13 px-7 py-3.5 bg-ink text-white font-semibold hover:bg-brand transition-colors shrink-0"
          >
            สมัครร่วมงานเลย
            <ArrowRight className="w-4 h-4" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}

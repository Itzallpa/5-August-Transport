"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { COMPANY_INFO, resolveLineId } from "@/lib/constants";
import PartnerBanner from "@/components/home/PartnerBanner";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SiteLayout } from "@/lib/site-layout";
import { Editable, ImageEditButton } from "@/components/editor/EditorContext";
import Swal from "sweetalert2";


export default function Hero({
  content,
  layout,
}: {
  content?: Partial<SiteContentData>;
  layout?: SiteLayout;
}) {
  const [trackingId, setTrackingId] = useState("");

  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const lineId = resolveLineId(content?.lineId);
  const email = content?.email || COMPANY_INFO.email;
  // The coded partner banner replaces the old poster images. If an admin uploads a
  // different picture via the editor, show that picture instead (uncropped).
  const rawHeroImage = content?.heroImageUrl;
  const LEGACY_POSTERS = ["/images/hero-cover.jpg", "/images/hero-cover-v2.jpg", "/images/hero.jpg"];
  const customHeroImage = rawHeroImage && !LEGACY_POSTERS.includes(rawHeroImage) ? rawHeroImage : null;

  const heading = content?.heroHeading || "ทุกเส้นทาง";
  const headingHighlight = content?.heroHeadingHighlight || "เราพร้อมส่งต่อความมั่นใจ";
  const subheading =
    content?.heroSubheading || "บริการขนส่งสินค้าและโลจิสติกส์ ครบวงจร สำหรับธุรกิจของคุณ";
  const badge = content?.heroBadge || "ครอบคลุมทั่วประเทศ • รวดเร็ว • ปลอดภัย • ตรงเวลา";
  const ctaQuote = layout?.textOverrides?.["t:hero:ctaQuote"] || "ขอใบเสนอราคา";
  const ctaDriver = content?.heroCtaDriverText || "สมัครขับรถร่วมกับเรา";

  const stats = [
    { vf: "heroStat1Value", lf: "heroStat1Label", v: content?.heroStat1Value || "99.8%", l: content?.heroStat1Label || "ตรงต่อเวลาเฉลี่ย" },
    { vf: "heroStat2Value", lf: "heroStat2Label", v: content?.heroStat2Value || "200+", l: content?.heroStat2Label || "กองรถพร้อมให้บริการ" },
    { vf: "heroStat3Value", lf: "heroStat3Label", v: content?.heroStat3Value || "77", l: content?.heroStat3Label || "จังหวัดที่ให้บริการ" },
    { vf: "heroStat4Value", lf: "heroStat4Label", v: content?.heroStat4Value || "24/7", l: content?.heroStat4Label || "ศูนย์ควบคุมเดินรถ" },
  ];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุเลขพัสดุหรือปลายทาง",
        text: "โปรดใส่หมายเลขติดตาม (Tracking ID) หรือจังหวัดปลายทาง",
        confirmButtonColor: "#C1121F",
      });
      return;
    }
    const safeId = trackingId.replace(/[<>&"']/g, "");
    Swal.fire({
      icon: "info",
      title: "ตรวจสอบสถานะการขนส่ง",
      html: `<div style="text-align:left;font-size:14px;line-height:1.7">
        <p>หมายเลขติดตาม: <strong>${safeId}</strong></p>
        <p style="color:#4A443D">รถทุกคันติดตาม GPS แบบเรียลไทม์ตลอด 24 ชม. สอบถามสถานะล่าสุดได้ที่ศูนย์ควบคุมเดินรถ</p>
      </div>`,
      showCancelButton: true,
      confirmButtonText: `โทร ${phone}`,
      cancelButtonText: "ปิด",
      confirmButtonColor: "#C1121F",
    }).then((res) => {
      if (res.isConfirmed) window.location.href = `tel:${phoneRaw}`;
    });
  };

  return (
    <section id="home" className="bg-ink text-paper">
      {/* 1. Partner recruitment banner */}
      <div className="bg-paper px-3 sm:px-6 md:px-8 py-4 sm:py-6">
        <div className="relative max-w-[1600px] mx-auto">
          <ImageEditButton field="heroImageUrl" label="เปลี่ยนเป็นรูปภาพแบนเนอร์" className="absolute top-4 right-4 z-30" />
          {customHeroImage ? (
            <a href="#recruitment" className="block border border-line bg-white" title="ดูรายละเอียดและสมัครร่วมงาน">
              <Image
                src={customHeroImage}
                alt="5 August Transport — แบนเนอร์หน้าแรก"
                width={3200}
                height={1312}
                priority
                unoptimized
                className="w-full h-auto select-none"
              />
            </a>
          ) : (
            <PartnerBanner phone={phone} phoneRaw={phoneRaw} lineId={lineId} email={email} />
          )}
        </div>
      </div>

      {/* 2. Headline + actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow text-paper/70 mb-5 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-brand" aria-hidden />
            <Editable field="heroBadge" value={badge} noTransform />
          </p>
          <h1 className="text-4xl leading-[1.15] sm:text-5xl lg:text-6xl lg:leading-[1.1] font-semibold tracking-tight">
            <Editable field="heroHeading" value={heading} noTransform />{" "}
            <span className="text-paper/70">
              <Editable field="heroHeadingHighlight" value={headingHighlight} noTransform />
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-paper/75 leading-relaxed">
            <Editable field="heroSubheading" value={subheading} multiline noTransform />
          </p>
        </div>
        <div className="lg:col-span-4 flex flex-wrap lg:flex-col lg:items-stretch gap-3">
          <a
            href="#quote"
            className="inline-flex items-center justify-between gap-2 h-12 px-6 bg-brand hover:bg-brand-deep text-white font-medium transition-colors"
          >
            <Editable field="t:hero:ctaQuote" value={ctaQuote} noTransform />
            <ArrowRight className="w-4 h-4" aria-hidden />
          </a>
          <a
            href="#recruitment"
            className="inline-flex items-center justify-between gap-2 h-12 px-6 border border-paper/40 hover:border-paper hover:bg-paper hover:text-ink font-medium transition-colors"
          >
            <Editable field="heroCtaDriverText" value={ctaDriver} noTransform />
            <ArrowRight className="w-4 h-4" aria-hidden />
          </a>
          <a
            href={`tel:${phoneRaw}`}
            className="inline-flex items-center justify-between gap-2 h-12 px-6 text-paper/80 hover:text-paper font-mono tabular border border-transparent hover:border-line-dark transition-colors"
          >
            {phone}
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </a>
        </div>
      </div>

      {/* Stats + tracking strip */}
      <div className="border-t border-line-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12">
          <dl className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.vf}
                className={`py-6 sm:py-8 pr-4 ${i > 0 ? "sm:border-l sm:pl-6" : ""} ${i % 2 === 1 ? "border-l pl-4 sm:pl-6" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} border-line-dark`}
              >
                <dt className="text-xs text-paper/60 leading-snug">
                  <Editable field={s.lf} value={s.l} noTransform />
                </dt>
                <dd className="mt-2 font-mono text-3xl sm:text-4xl text-paper tabular tracking-tight">
                  <Editable field={s.vf} value={s.v} noTransform />
                </dd>
              </div>
            ))}
          </dl>

          <form
            onSubmit={handleTrack}
            className="lg:col-span-4 lg:border-l border-t lg:border-t-0 border-line-dark py-6 sm:py-8 lg:pl-8 flex flex-col justify-center"
          >
            <label htmlFor="hero-track" className="text-xs text-paper/60 mb-2">
              ติดตามสถานะการขนส่ง
            </label>
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-paper/50" aria-hidden />
                <input
                  id="hero-track"
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="เลขพัสดุ หรือ จังหวัดปลายทาง"
                  className="w-full h-12 pl-9 pr-3 bg-ink-2 border border-line-dark text-paper placeholder:text-paper/45 text-sm focus:outline-none focus:border-paper"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-5 bg-paper text-ink text-sm font-medium hover:bg-white transition-colors"
              >
                ตรวจสอบ
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

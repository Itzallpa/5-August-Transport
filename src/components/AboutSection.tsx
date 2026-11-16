"use client";

import { useCallback, useState } from "react";
import { useEscapeKey } from "@/lib/use-escape-key";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { Editable, ImageEditButton } from "@/components/editor/EditorContext";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutSection({ content }: { content?: Partial<SiteContentData> }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const closeVideo = useCallback(() => setIsVideoModalOpen(false), []);
  useEscapeKey(isVideoModalOpen, closeVideo);

  const nameTh = content?.nameTh || COMPANY_INFO.nameTh;
  const aboutImage = content?.aboutImageUrl || "/images/operations.jpg";
  const aboutBadge = content?.aboutBadge || "เกี่ยวกับเรา";
  const aboutTitle = content?.aboutTitle || "ขนส่งที่ธุรกิจวางใจ มากว่าสิบปี";
  const aboutSubtitle =
    content?.aboutSubtitle || "มุ่งมั่นสร้างมาตรฐานใหม่แห่งการขนส่งไทย ด้วยความซื่อสัตย์ ตรงเวลา และความปลอดภัยสูงสุด";
  const aboutStory1 =
    content?.aboutStory1 ||
    "ผู้ให้บริการขนส่งสินค้าและโลจิสติกส์ครบวงจรในประเทศไทย ร่วมกับพันธมิตรระดับประเทศอย่าง KEX Express ในงานสายหลัก Linehaul ทั่วประเทศ";
  const aboutStory2 =
    content?.aboutStory2 ||
    "กองรถกว่า 200 คัน ทั้ง 4 ล้อตู้ทึบ 4 ล้อจัมโบ้ 6 ล้อ และงานเหมาคัน ทุกคันติดตั้ง GPS และควบคุมความเร็วตลอด 24 ชั่วโมง";
  const aboutExpYears = content?.aboutExpYears || "10+ ปี";
  const aboutExpText = content?.aboutExpText || "ความเชี่ยวชาญในธุรกิจขนส่งและโลจิสติกส์";
  const capital = content?.aboutRegisteredCapital || "5,000,000 บาท (ชำระเต็มจำนวน)";
  const vision =
    content?.aboutVision || "เป็นผู้นำด้านโลจิสติกส์ที่ได้รับความไว้วางใจสูงสุดในประเทศไทย";
  const mission =
    content?.aboutMission || "ส่งมอบสินค้าทุกชิ้นอย่างปลอดภัย ตรงเวลา และพัฒนาคุณภาพชีวิตของคนขับรถร่วม";
  const opsBadge = content?.aboutOperationsBadge || "24/7 Logistics Control Tower";
  const opsSub = content?.aboutOperationsSub || "ติดตามสถานะความปลอดภัยและ GPS ทุกคัน";

  const facts = [
    { label: "ประสบการณ์", field: "aboutExpYears", value: aboutExpYears, note: { field: "aboutExpText", value: aboutExpText } },
    { label: "ทุนจดทะเบียน", field: "aboutRegisteredCapital", value: capital },
    { label: "พันธมิตรหลัก", value: "KEX Express — Linehaul" },
    { label: "พื้นที่ให้บริการ", value: "ทุกภูมิภาคทั่วประเทศไทย" },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="01"
          label={<Editable field="aboutBadge" value={aboutBadge} noTransform />}
          title={<Editable field="aboutTitle" value={aboutTitle} noTransform />}
          intro={<Editable field="aboutSubtitle" value={aboutSubtitle} multiline noTransform />}
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Story */}
          <div className="lg:col-span-5 space-y-5 text-ink-soft leading-relaxed">
            <p className="text-lg text-ink">
              {!aboutStory1.includes(nameTh) && <span className="font-semibold">{nameTh} </span>}
              <Editable field="aboutStory1" value={aboutStory1} multiline noTransform />
            </p>
            <p>
              <Editable field="aboutStory2" value={aboutStory2} multiline noTransform />
            </p>

            <dl className="pt-4 grid sm:grid-cols-2 gap-x-8 border-t border-line">
              {facts.map((f) => (
                <div key={f.label} className="py-4 border-b border-line">
                  <dt className="eyebrow text-muted">{f.label}</dt>
                  <dd className="mt-1.5 text-ink font-medium">
                    {f.field ? <Editable field={f.field} value={f.value} noTransform /> : f.value}
                    {f.note && (
                      <span className="block text-sm font-normal text-muted mt-0.5">
                        <Editable field={f.note.field} value={f.note.value} noTransform />
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Photo + vision/mission */}
          <div className="lg:col-span-7">
            <figure className="relative">
              <div className="relative aspect-[16/10] bg-ink overflow-hidden">
                <Image
                  src={aboutImage}
                  alt="ศูนย์ควบคุมการเดินรถ 5 August Transport"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
                <ImageEditButton field="aboutImageUrl" label="เปลี่ยนรูปภาพ" className="absolute top-3 right-3 z-30" />
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="absolute left-4 bottom-4 inline-flex items-center gap-3 h-12 pl-2 pr-5 bg-paper text-ink text-sm font-medium hover:bg-white transition-colors"
                >
                  <span className="w-8 h-8 inline-flex items-center justify-center bg-brand text-white">
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden />
                  </span>
                  ดูวิดีโอแนะนำบริษัท
                </button>
              </div>
              <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-muted">
                <span className="text-ink">
                  <Editable field="aboutOperationsBadge" value={opsBadge} noTransform />
                </span>
                <span>
                  <Editable field="aboutOperationsSub" value={opsSub} noTransform />
                </span>
              </figcaption>
            </figure>

            <div className="mt-10 grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="eyebrow text-brand">วิสัยทัศน์</h3>
                <p className="mt-3 text-ink leading-relaxed">
                  <Editable field="aboutVision" value={vision} multiline noTransform />
                </p>
              </div>
              <div>
                <h3 className="eyebrow text-brand">พันธกิจ</h3>
                <p className="mt-3 text-ink leading-relaxed">
                  <Editable field="aboutMission" value={mission} multiline noTransform />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90"
          role="dialog"
          aria-modal="true"
          aria-label="วิดีโอแนะนำบริษัท"
          onClick={closeVideo}
        >
          <div className="relative w-full max-w-4xl bg-black" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeVideo}
              autoFocus
              className="absolute -top-12 right-0 w-11 h-11 inline-flex items-center justify-center text-paper hover:text-white"
              aria-label="ปิดวิดีโอ"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/DWRcNpR6Kdc?autoplay=1"
                title="วิดีโอแนะนำ 5 August Transport"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

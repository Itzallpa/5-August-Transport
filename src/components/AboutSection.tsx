"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Award, X, Truck, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { Editable, ImageEditButton } from "@/components/editor/EditorContext";
import type { SiteContentData } from "@/app/actions/site-content-actions";

export default function AboutSection({ content }: { content?: Partial<SiteContentData> }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const nameTh = content?.nameTh || COMPANY_INFO.nameTh;
  const aboutImage = content?.aboutImageUrl || "/images/thai_transport_loading.jpg";
  const aboutBadge = content?.aboutBadge || "ABOUT US";
  const aboutTitle = content?.aboutTitle || "Trusted & Faster Logistic Service Provider";
  const aboutExpYears = content?.aboutExpYears || "10+ Years Experience";
  const aboutExpText =
    content?.aboutExpText || "ประสบการณ์กว่า 10 ปี ในธุรกิจขนส่งและโลจิสติกส์มืออาชีพ";
  const aboutStory1 =
    content?.aboutStory1 ||
    " ผู้เชี่ยวชาญด้านการให้บริการขนส่งสินค้าและโซลูชันโลจิสติกส์ครบวงจรในประเทศไทย ดำเนินธุรกิจด้วยความซื่อสัตย์ ตรงต่อเวลา และรักษามาตรฐานความปลอดภัยสูงสุด ร่วมมือกับพันธมิตรชั้นนำระดับประเทศ อาทิ KEX Express ในการวิ่งงานสายหลัก Linehaul (LH) ทั่วประเทศ";
  const aboutStory2 =
    content?.aboutStory2 ||
    "เรามีความพร้อมทั้งกองยานพาหนะขนาดใหญ่กว่า 200 คัน ทั้งรถ 4 ล้อตู้ทึบ, 4 ล้อจัมโบ้, 6 ล้อ และงานเหมาคัน ทุนจดทะเบียน 5,000,000 บาท (ชำระเต็มจำนวน) พร้อมระบบควบคุมความเร็วด้วย GPS ตลอด 24 ชั่วโมง";

  return (
    <section id="about" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Attached Red Experience Badge (matching FASTER exactly) */}
          <div className="lg:col-span-5 pb-4 lg:pb-0">
            <div className="relative rounded-lg overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 group">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={aboutImage}
                  alt="5 August Transport Team & Operations"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <ImageEditButton field="aboutImageUrl" label="📷 เปลี่ยนรูปภาพ" className="absolute top-3 right-3 z-30" />
              </div>

              {/* FASTER Attached Experience Banner in Brand Primary Red */}
              <div className="bg-[#D32F2F] text-white text-center p-5 sm:p-6 shadow-md">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide m-0">
                  <Editable field="aboutExpYears" value={aboutExpYears} noTransform />
                </h3>
                <span className="text-xs sm:text-sm font-medium text-white/90 block mt-1">
                  <Editable field="aboutExpText" value={aboutExpText} noTransform />
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: About Us Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h6 className="text-[#D32F2F] text-xs sm:text-sm font-black uppercase tracking-widest mb-2 font-mono">
                <Editable field="aboutBadge" value={aboutBadge} noTransform />
              </h6>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                <Editable field="aboutTitle" value={aboutTitle} noTransform />
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <strong>{nameTh} (5 AUGUST TRANSPORT)</strong>{" "}
              <Editable field="aboutStory1" value={aboutStory1} multiline noTransform />
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <Editable field="aboutStory2" value={aboutStory2} multiline noTransform />
            </p>

            {/* Credibility highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <span>พันธมิตรขนส่ง KEX Express - Linehaul</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <span>ทุนจดทะเบียน 5,000,000 บาท (มั่นคง 100%)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <span>ระบบ GPS Tracking และประกันภัยสินค้า</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <span>บริการวิ่งงานครอบคลุมทุกภูมิภาคทั่วไทย</span>
              </div>
            </div>

            {/* FASTER Play Video / Presentation Button & Contact */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="btn-play"
                  aria-label="Play Video Presentation"
                >
                  <span />
                </button>
                <div className="ml-5">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                    วิดีโอแนะนำบริษัท
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">ชมภาพบรรยากาศการทำงาน</span>
                </div>
              </div>

              <div className="hidden sm:block border-l border-slate-200 pl-6">
                <a
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#D32F2F] hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>โทร: {phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-black rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/DWRcNpR6Kdc?autoplay=1"
                title="5 August Transport Logistics Video"
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

import Image from "next/image";
import { ShieldCheck, Target, Eye, Award, CheckCircle, Navigation } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";

export default function AboutSection({ content }: { content?: Partial<SiteContentData> }) {
  const nameTh = content?.nameTh || COMPANY_INFO.nameTh;
  const aboutBadge = content?.aboutBadge || "เกี่ยวกับเรา • วิสัยทัศน์และพันธกิจ";
  const aboutTitle = content?.aboutTitle || "พร้อมส่งต่อความมั่นใจในทุกการเดินทาง";
  const aboutSubtitle = content?.aboutSubtitle || "เราคือผู้เชี่ยวชาญด้านการให้บริการขนส่งสินค้าและโซลูชันโลจิสติกส์ครบวงจรในประเทศไทย ดำเนินธุรกิจด้วยความซื่อสัตย์ ตรงต่อเวลา และรักษามาตรฐานความปลอดภัยสูงสุด ร่วมมือกับพันธมิตรระดับประเทศ เพื่อส่งมอบบริการที่คุ้มค่าและมีประสิทธิภาพสูงสุดให้แก่คู่ค้า";
  const aboutVision = content?.aboutVision || "มุ่งสู่การเป็นผู้นำด้านโลจิสติกส์และการขนส่งสินค้าที่ได้รับความไว้วางใจสูงสุดในภูมิภาค ขับเคลื่อนด้วยเทคโนโลยีและความเป็นมืออาชีพ";
  const aboutMission = content?.aboutMission || "ส่งมอบสินค้าตรงเวลา ปลอดภัย 100% พร้อมสร้างงานและรายได้ที่มั่นคงเป็นธรรมแก่ผู้ร่วมขับรถทุกคน และสนับสนุนการเติบโตของธุรกิจลูกค้าอย่างยั่งยืน";
  const aboutCapital = content?.aboutRegisteredCapital || "5,000,000 บาท (ชำระเต็มจำนวน)";
  const aboutImageUrl = content?.aboutImageUrl || "/images/operations.jpg";
  const operationsBadge = content?.aboutOperationsBadge || "24/7 Logistics Control Tower";
  const operationsSub = content?.aboutOperationsSub || "ติดตามสถานะความปลอดภัยและ GPS ทุกคัน";
  const expYears = content?.aboutExpYears || "10+ ปี";
  const expText = content?.aboutExpText || "ความเชี่ยวชาญในธุรกิจขนส่งและโลจิสติกส์";

  return (
    <section id="about" className="py-24 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual & Operations Command Image */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
              <div className="relative h-72 sm:h-96 w-full">
                <Image
                  src={aboutImageUrl}
                  alt="5 August Transport Logistics Control Center"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{operationsBadge}</h4>
                    <p className="text-xs text-slate-300">{operationsSub}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  มาตรฐานความปลอดภัย 100%
                </span>
              </div>
            </div>

            {/* Credibility highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-black text-2xl text-[#D32F2F]">{expYears}</div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">
                  {expText}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-black text-2xl text-slate-900">{aboutCapital}</div>
                <div className="text-xs text-slate-600 font-medium mt-0.5">
                  ทุนจดทะเบียนรองรับงานระดับองค์กร
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Vision, Mission, Values */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold tracking-wider uppercase">
                {aboutBadge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                {nameTh} <br />
                <span className="text-[#D32F2F]">{aboutTitle}</span>
              </h2>
              <p className="text-slate-600 leading-relaxed font-light text-base sm:text-lg">
                {aboutSubtitle}
              </p>
            </div>

            {/* Vision & Mission Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 hover:border-red-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">วิสัยทัศน์ (Vision)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {aboutVision}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 hover:border-red-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">พันธกิจ (Mission)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {aboutMission}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values checklist */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                ค่านิยมหลักขององค์กร (Core Values):
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>ความซื่อสัตย์และโปร่งใส (Integrity)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>ความปลอดภัยเป็นหนึ่ง (Safety First)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>ตรงต่อเวลาเสมอ (Punctuality)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>พัฒนาด้วยเทคโนโลยี (Innovation)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


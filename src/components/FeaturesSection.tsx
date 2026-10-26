import Image from "next/image";
import { CheckCircle2, ShieldCheck, Clock, Award, Headphones, ArrowRight, Phone } from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { COMPANY_INFO } from "@/lib/constants";

export default function FeaturesSection({ content }: { content?: Partial<SiteContentData> }) {
  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;

  const features = [
    {
      title: "Best In Industry (มาตรฐานบริการระดับมืออาชีพ)",
      desc: "พันธมิตรขนส่ง KEX Express - Linehaul รถทุกคันตรวจสภาพสม่ำเสมอ คนขับสุภาพ มีวินัย",
    },
    {
      title: "Real-time GPS Tracking 24/7 (ระบบติดตามความเร็วและตำแหน่ง)",
      desc: "ควบคุมความเร็วตามกฎหมายกรมการขนส่ง รายงานสถานะพัสดุและตำแหน่งรถแบบเรียลไทม์ 24 ชม.",
    },
    {
      title: "Cargo Insurance & Safety (ประกันภัยสินค้าเต็มมูลค่า)",
      desc: "คุ้มครองสินค้าและพัสดุตลอดเส้นทาง ตู้ทึบสะอาด ปิดล็อกมิดชิด ป้องกันน้ำฝน 100%",
    },
    {
      title: "24/7 Customer Support (ศูนย์ควบคุมและประสานงาน 24 ชม.)",
      desc: "ทีม Dispatching สแตนด์บายพร้อมแก้ปัญหาฉุกเฉินและจัดสรรรถเสริมได้ทันทีทั่วประเทศ",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-24 bg-[#F2F2F4] text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Fitted Fleet Image (matching FASTER format exactly) */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-xl border border-slate-200 group bg-slate-900">
              <Image
                src="/images/solution-truck.jpg"
                alt="5 August Transport Fleet Safety & Reliability"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <span className="px-3 py-1 bg-[#D32F2F] text-white text-xs font-bold rounded">
                  GPS Tracking 24 ชม. • ประกันสินค้า 100%
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Why Choose Us Content */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h6 className="text-[#D32F2F] text-xs sm:text-sm font-black uppercase tracking-widest mb-2 font-mono">
                WHY CHOOSE US
              </h6>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Faster, Safe and Trusted Logistics Services
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              บริษัท 5 สิงหา ทรานสปอร์ต จำกัด มุ่งมั่นส่งมอบบริการขนส่งสินค้าและโลจิสติกส์ที่รวดเร็ว ปลอดภัย และตรงต่อเวลา เพื่อสนับสนุนการเติบโตอย่างยั่งยืนของธุรกิจคุณ พร้อมระบบบริหารจัดการกองยานพาหนะทันสมัย
            </p>

            {/* Bullet points with red check icons */}
            <div className="space-y-4 pt-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {f.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#quote"
                className="px-6 py-3 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-md shadow-red-950/20 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <span>ขอใบเสนอราคา / เช็คราคา</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${phoneRaw}`}
                className="px-6 py-3 rounded-lg bg-[#1F1F2E] hover:bg-black text-white font-bold text-sm transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#D32F2F]" />
                <span>โทรด่วน: {phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

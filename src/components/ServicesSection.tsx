import { Truck, Box, ShieldCheck, Clock, MapPin, Warehouse, ArrowRight, CheckCircle2 } from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SiteLayout } from "@/lib/site-layout";
import { Editable } from "@/components/editor/EditorContext";

export default function ServicesSection({
  content,
  layout,
}: {
  content?: Partial<SiteContentData>;
  layout?: SiteLayout;
}) {
  const badge = layout?.textOverrides?.["t:services:badge"] || "OUR SERVICES";
  const title = layout?.textOverrides?.["t:services:title"] || "บริการขนส่งสินค้ามาตรฐานระดับประเทศ";
  const subtitle =
    layout?.textOverrides?.["t:services:subtitle"] ||
    "พร้อมตอบโจทย์ธุรกิจทุกขนาด พันธมิตรขนส่ง KEX Express - Linehaul กองรถ 4 ล้อ, 4 ล้อจัมโบ้, 6 ล้อ และงานเหมาคันครอบคลุมทั่วประเทศ";
  const services = [
    {
      id: "4w",
      icon: Truck,
      title: "รถกระบะ 4 ล้อ ตู้ทึบ",
      titleEn: "4-Wheel Light Truck",
      cbm: "4.5 - 6.6 CBM",
      weight: "1.0 - 1.5 ตัน",
      desc: "คล่องตัวสูง เข้าซอยแคบ ตู้ทึบกันฝน 100% เหมาะสำหรับงานกระจายพัสดุด่วน ร้านค้า Modern Trade และ Last Mile",
      href: "#solutions",
    },
    {
      id: "4wj",
      icon: Box,
      title: "รถ 4 ล้อ จัมโบ้ (4WJ)",
      titleEn: "Jumbo 4-Wheel Truck",
      cbm: "10.8 CBM",
      weight: "สูงสุด 3 ตัน",
      desc: "จุสินค้ามากกว่ากระบะปกติถึง 50% คุ้มค่าสำหรับงาน E-Commerce กล่องพัสดุ สินค้าแฟชั่น และเฟอร์นิเจอร์",
      href: "#solutions",
    },
    {
      id: "6w",
      icon: MapPin,
      title: "รถ 6 ล้อ ตู้ทึบ (Linehaul)",
      titleEn: "6-Wheel Freight Truck",
      cbm: "30 CBM",
      weight: "5.0 - 8.0 ตัน",
      desc: "หัวใจงานสายหลัก เชื่อมโยงศูนย์กระจายสินค้า Hub-to-Hub และงาน Linehaul ของ KEX Express ข้ามภาคทั่วประเทศ",
      href: "#solutions",
    },
    {
      id: "contract",
      icon: Clock,
      title: "งานเหมาคัน & สัญญารายเดือน",
      titleEn: "Dedicated Fleet Contract",
      cbm: "ตามขนาดรถ",
      weight: "ตามสัญญา",
      desc: "บริการจัดสรรรถประจำโรงงานและคลังสินค้า พร้อมพนักงานขับรถประจำ ปฏิบัติงานตามตารางเวลาที่กำหนด",
      href: "#quote",
    },
    {
      id: "express",
      icon: ShieldCheck,
      title: "ขนส่งด่วนพิเศษ & ฉุกเฉิน 24 ชม.",
      titleEn: "Express & Emergency Dispatch",
      cbm: "ทุกขนาด",
      weight: "ด่วนพิเศษ",
      desc: "บริการวิ่งงานด่วนพิเศษ 24 ชม. ควบคุมความเร็วด้วยระบบ GPS Tracking รายงานตำแหน่งเรียลไทม์",
      href: "#quote",
    },
    {
      id: "warehouse",
      icon: Warehouse,
      title: "กระจายสินค้า & แรงงานช่วยยก",
      titleEn: "Cargo Handling & Staging",
      cbm: "ครบวงจร",
      weight: "มาตรฐานสากล",
      desc: "บริการตรวจนับสินค้า ยกของขึ้น-ลงตู้ด้วยทีมงานมืออาชีพ รัดสินค้าแน่นหนา ปลอดภัยตลอดการเคลื่อนย้าย",
      href: "#contact",
    },
  ];

  return (
    <section id="services" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h6 className="text-[#D32F2F] text-xs sm:text-sm font-black uppercase tracking-widest mb-2 font-mono">
            <Editable field="t:services:badge" value={badge} noTransform />
          </h6>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            <Editable field="t:services:title" value={title} noTransform />
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            <Editable field="t:services:subtitle" value={subtitle} multiline noTransform />
          </p>
        </div>

        {/* 6 Services Grid matching FASTER card style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="bg-[#F2F2F4] rounded-lg overflow-hidden border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* FASTER Card Header: Solid Primary Red with dark icon and white title */}
                  <div className="bg-[#D32F2F] group-hover:bg-[#B71C1C] transition-colors p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#1F1F2E] flex items-center justify-center shrink-0 text-white shadow-sm">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-lg leading-tight">
                        {s.title}
                      </h3>
                      <span className="text-white/80 text-xs font-medium">
                        {s.titleEn}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded border border-slate-200 w-fit">
                      <span className="text-[#D32F2F] font-black">{s.cbm}</span>
                      <span>•</span>
                      <span>{s.weight}</span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="px-6 pb-6 pt-2">
                  <a
                    href={s.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D32F2F] group-hover:text-[#B71C1C] border-b-2 border-[#D32F2F] pb-0.5 tracking-wide uppercase transition-all"
                  >
                    <span>ดูรายละเอียดเพิ่มเติม</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

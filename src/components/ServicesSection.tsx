import { Truck, Box, ShieldCheck, Clock, MapPin, Warehouse, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
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
  const badge = layout?.textOverrides?.["t:services:badge"] || "บริการ";
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
    <section id="services" className="py-20 sm:py-28 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={<Editable field="t:services:badge" value={badge} noTransform />}
          title={<Editable field="t:services:title" value={title} noTransform />}
          intro={<Editable field="t:services:subtitle" value={subtitle} multiline noTransform />}
        />

        {/* Column labels (desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-6 pb-3 eyebrow text-muted border-b border-ink">
          <span className="col-span-5">บริการ</span>
          <span className="col-span-2">ความจุ</span>
          <span className="col-span-2">น้ำหนักบรรทุก</span>
          <span className="col-span-3">เหมาะกับงาน</span>
        </div>

        <ul>
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.id} className="border-b border-line">
                <a
                  href={s.href}
                  className="group grid grid-cols-12 gap-x-6 gap-y-2 py-6 md:py-7 -mx-4 px-4 hover:bg-paper-2 transition-colors"
                >
                  <div className="col-span-12 md:col-span-5 flex items-start gap-4">
                    <Icon className="w-5 h-5 mt-1 text-brand shrink-0" aria-hidden />
                    <div>
                      <h3 className="text-xl text-ink font-medium leading-snug">{s.title}</h3>
                      <p className="text-sm text-muted mt-0.5">{s.titleEn}</p>
                    </div>
                  </div>
                  <p className="col-span-6 md:col-span-2 font-mono text-sm text-ink tabular md:pt-1.5">
                    <span className="md:hidden text-muted">ความจุ </span>{s.cbm}
                  </p>
                  <p className="col-span-6 md:col-span-2 font-mono text-sm text-ink tabular md:pt-1.5">
                    <span className="md:hidden text-muted">น้ำหนัก </span>{s.weight}
                  </p>
                  <div className="col-span-12 md:col-span-3 flex items-start justify-between gap-4">
                    <p className="text-sm text-ink-soft leading-relaxed">{s.desc}</p>
                    <ArrowUpRight
                      className="w-5 h-5 shrink-0 text-muted group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      aria-hidden
                    />
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

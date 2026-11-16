import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SiteLayout } from "@/lib/site-layout";
import { Editable } from "@/components/editor/EditorContext";
import { COMPANY_INFO } from "@/lib/constants";

export default function PricingSection({
  content,
  layout,
}: {
  content?: Partial<SiteContentData>;
  layout?: SiteLayout;
}) {
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const badge = layout?.textOverrides?.["t:pricing:badge"] || "อัตราค่าบริการ";
  const title = layout?.textOverrides?.["t:pricing:title"] || "อัตราค่าบริการขนส่งมาตรฐาน โปร่งใส คุ้มค่า";
  const subtitle =
    layout?.textOverrides?.["t:pricing:subtitle"] ||
    "อัตราค่าบริการมาตรฐานสำหรับงานขนส่งในเมือง ข้ามภาค และงานเหมาคัน สามารถคำนวณราคาออนไลน์หรือติดต่อเจ้าหน้าที่ได้ทันที";

  const plans = [
    {
      id: "4w-basic",
      name: "รถ 4 ล้อ ตู้ทึบ",
      nameEn: "Basic 4W Delivery",
      price: "1,200",
      unit: "/ เที่ยว",
      isPopular: false,
      features: [
        "ความจุ 4.5 – 6.6 CBM",
        "รองรับน้ำหนัก 1.0 – 1.5 ตัน",
        "ขนาดตู้: 2.10 x 1.40 x 1.80 ม.",
        "ระบบ GPS Tracking 24 ชม.",
        "ตู้ทึบกันน้ำฝน 100%",
        "เหมาะสำหรับ Last Mile & Modern Trade",
      ],
      href: "#quote",
    },
    {
      id: "4w-jumbo",
      name: "รถ 4 ล้อ จัมโบ้ (4WJ)",
      nameEn: "Jumbo 4W E-Commerce",
      price: "1,500",
      unit: "/ เที่ยว",
      isPopular: true,
      features: [
        "ความจุปริมาตรพิเศษ 10.8 CBM",
        "รองรับน้ำหนักสูงสุด 3 ตัน",
        "ขนาดตู้: 3.00 x 1.80 x 2.00 ม.",
        "จุสินค้ามากกว่ากระบะปกติถึง 50%",
        "ระบบ GPS Tracking 24 ชม.",
        "คุ้มค่าสำหรับกล่องพัสดุและ E-Commerce",
      ],
      href: "#quote",
    },
    {
      id: "6w-linehaul",
      name: "รถ 6 ล้อ ตู้ทึบ (6W)",
      nameEn: "Business 6W Linehaul",
      price: "2,800",
      unit: "/ เที่ยว",
      isPopular: false,
      features: [
        "ความจุกว้างขวาง 30 CBM",
        "รองรับน้ำหนักบรรทุก 5.0 ตัน",
        "รองรับ 10 – 14 พาเลทมาตรฐาน",
        "วิ่งงาน Hub-to-Hub ข้ามภาค",
        "ระบบ GPS & ประกันสินค้าเต็มวงเงิน",
        "พันธมิตรวิ่งงาน KEX Express Linehaul",
      ],
      href: "#quote",
    },
    {
      id: "dedicated-contract",
      name: "งานเหมาคันรายเดือน",
      nameEn: "Monthly Dedicated Contract",
      price: "พิเศษ",
      unit: "ตามตกลง",
      isPopular: false,
      features: [
        "จัดสรรรถประจำโรงงาน / คลังสินค้า",
        "พนักงานขับรถประจำตรวจประวัติ",
        "รองรับทั้ง 4 ล้อ, 4 ล้อจัมโบ้, 6 ล้อ",
        "วางบิลตามรอบ สัญญาโปร่งใส",
        "มีรถสำรองทดแทนกรณีฉุกเฉิน 24/7",
        "ทีม Dispatcher ดูแลส่วนตัว",
      ],
      href: `tel:${phoneRaw}`,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={<Editable field="t:pricing:badge" value={badge} noTransform />}
          title={<Editable field="t:pricing:title" value={title} noTransform />}
          intro={<Editable field="t:pricing:subtitle" value={subtitle} multiline noTransform />}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-line">
          {plans.map((p) => (
            <article
              key={p.id}
              className={`relative flex flex-col border-r border-b border-line ${p.isPopular ? "bg-white" : ""}`}
            >
              {p.isPopular && <div className="absolute inset-x-0 -top-px h-1 bg-brand" aria-hidden />}
              <div className="p-6 sm:p-7 flex-1">
                <div className="flex items-start justify-between gap-3 min-h-[3.5rem]">
                  <div>
                    <h3 className="text-lg text-ink font-medium leading-snug">{p.name}</h3>
                    <p className="text-xs text-muted mt-0.5">{p.nameEn}</p>
                  </div>
                  {p.isPopular && <span className="eyebrow text-brand shrink-0">แนะนำ</span>}
                </div>

                <p className="mt-8 text-xs text-muted">{p.price === "พิเศษ" ? "ราคา" : "เริ่มต้น"}</p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-4xl text-ink tabular tracking-tight">
                    {p.price === "พิเศษ" ? "ตามสัญญา" : `฿${p.price}`}
                  </span>
                  {p.price !== "พิเศษ" && <span className="text-sm text-muted">{p.unit}</span>}
                </p>

                <ul className="mt-8 space-y-3 text-sm text-ink-soft">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex gap-3">
                      <span className="mt-2 w-1.5 h-1.5 bg-ink shrink-0" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={p.href}
                className={`m-6 sm:m-7 mt-0 sm:mt-0 inline-flex items-center justify-between h-12 px-5 text-sm font-medium transition-colors ${
                  p.isPopular
                    ? "bg-brand hover:bg-brand-deep text-white"
                    : "border border-ink text-ink hover:bg-ink hover:text-paper"
                }`}
              >
                {p.id === "dedicated-contract" ? "โทรคุยสัญญา" : "จองรถคันนี้"}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </a>
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">* ราคายังไม่รวมภาษีมูลค่าเพิ่ม ราคาจริงขึ้นกับระยะทาง ประเภทสินค้า และจำนวนจุดส่ง</p>
      </div>
    </section>
  );
}

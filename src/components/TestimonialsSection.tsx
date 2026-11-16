import SectionHeading from "@/components/ui/SectionHeading";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SiteLayout } from "@/lib/site-layout";
import { Editable } from "@/components/editor/EditorContext";

export default function TestimonialsSection({
  content,
  layout,
}: {
  content?: Partial<SiteContentData>;
  layout?: SiteLayout;
}) {
  const badge = layout?.textOverrides?.["t:testimonials:badge"] || "เสียงจากลูกค้า";
  const title = layout?.textOverrides?.["t:testimonials:title"] || "เสียงตอบรับจากลูกค้าผู้ใช้บริการ";
  const subtitle =
    layout?.textOverrides?.["t:testimonials:subtitle"] ||
    "ความไว้วางใจจากลูกค้าองค์กร ธุรกิจชั้นนำ และคู่ค้าคือแรงผลักดันให้เราพัฒนาบริการอย่างไม่หยุดยั้ง";
  const testimonials = [
    {
      id: "rev1",
      name: "คุณวิชาญ วัฒนกิจ",
      role: "ผู้จัดการฝ่ายโลจิสติกส์ • เครือ Modern Trade",
      avatar: "/images/faster/testimonial-1.jpg",
      text: "5 สิงหา ทรานสปอร์ต ส่งของตรงเวลามาก สินค้าไม่เคยมีปัญหาแตกหักเสียหาย ตู้ทึบสะอาด มีระบบ GPS ให้เช็คตำแหน่งได้ตลอด 24 ชม. ช่วยให้ทีมงานวางแผนงานจัดส่งต่อได้ราบรื่น",
    },
    {
      id: "rev2",
      name: "คุณกมลทิพย์ ศรีเจริญ",
      role: "เจ้าของแบรนด์สินค้า E-Commerce & แฟชั่น",
      avatar: "/images/faster/testimonial-2.jpg",
      text: "ใช้บริการรถ 4 ล้อจัมโบ้ (10.8 CBM) ของที่นี่เป็นประจำ จุกล่องพัสดุได้เยอะมาก ประหยัดเที่ยววิ่งได้เกือบเท่าตัว คนขับช่วยจัดเรียงและยกของอย่างระมัดระวัง ประทับใจมากค่ะ",
    },
    {
      id: "rev3",
      name: "คุณสมพงษ์ ฤทธิเดช",
      role: "หัวหน้าฝ่ายคลังและกระจายสินค้า Hub ข้ามภาค",
      avatar: "/images/faster/testimonial-3.jpg",
      text: "ร่วมวิ่งงานสายหลัก Linehaul กับ 5 August Transport มาหลายปี รถทุกคันตรวจสภาพพร้อมวิ่งเสมอ คนขับชำนาญทางหลวงข้ามภาค ส่งถึงปลายทางตรงตาม KPI ทุกเที่ยว",
    },
    {
      id: "rev4",
      name: "คุณนฤมล ประเสริฐสุข",
      role: "ผู้ประสานงานจัดซื้อและการขนส่งโรงงานอุตสาหกรรม",
      avatar: "/images/faster/testimonial-4.jpg",
      text: "ทำสัญญารถเหมาคันรายเดือนกับ 5 August ประทับใจในความเป็นมืออาชีพ ทั้งการวางบิลที่โปร่งใส และการมีรถสำรองสแตนด์บายฉุกเฉินตลอดเวลา ไม่เคยทำให้ไลน์ผลิตสะดุดเลยค่ะ",
    },
  ];

  const [lead, ...rest] = testimonials;

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={<Editable field="t:testimonials:badge" value={badge} noTransform />}
          title={<Editable field="t:testimonials:title" value={title} noTransform />}
          intro={<Editable field="t:testimonials:subtitle" value={subtitle} multiline noTransform />}
        />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <figure className="lg:col-span-7">
            <span className="block font-serif text-7xl leading-none text-brand select-none" aria-hidden>
              &ldquo;
            </span>
            <blockquote className="-mt-4 text-2xl sm:text-3xl leading-snug text-ink font-medium tracking-tight">
              {lead.text}
            </blockquote>
            <figcaption className="mt-8 pt-4 border-t border-line">
              <p className="text-ink font-medium">{lead.name}</p>
              <p className="text-sm text-muted">{lead.role}</p>
            </figcaption>
          </figure>

          <div className="lg:col-span-5 border-t border-ink">
            {rest.map((t) => (
              <figure key={t.id} className="py-6 border-b border-line">
                <blockquote className="text-ink-soft leading-relaxed">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="text-ink font-medium">{t.name}</span>
                  <span className="text-muted"> — {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

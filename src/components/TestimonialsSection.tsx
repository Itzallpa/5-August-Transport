import Image from "next/image";
import { Star, Quote } from "lucide-react";
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
  const badge = layout?.textOverrides?.["t:testimonials:badge"] || "TESTIMONIAL";
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

  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h6 className="text-[#D32F2F] text-xs sm:text-sm font-black uppercase tracking-widest mb-2 font-mono">
            <Editable field="t:testimonials:badge" value={badge} noTransform />
          </h6>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            <Editable field="t:testimonials:title" value={title} noTransform />
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            <Editable field="t:testimonials:subtitle" value={subtitle} multiline noTransform />
          </p>
        </div>

        {/* Testimonial Cards in FASTER Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#F2F2F4] rounded-lg p-6 relative border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-[#D32F2F]/20" />

              <div>
                {/* Header with Avatar & Name */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#D32F2F]/30">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-snug">
                      {t.role}
                    </p>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

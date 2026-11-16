import Image from "next/image";
import { Phone, MessageSquare } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SiteLayout } from "@/lib/site-layout";
import { Editable } from "@/components/editor/EditorContext";
import { COMPANY_INFO, resolveLineId } from "@/lib/constants";

export default function DeliveryTeamSection({
  content,
  layout,
}: {
  content?: Partial<SiteContentData>;
  layout?: SiteLayout;
}) {
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const lineId = resolveLineId(content?.lineId);
  const badge = layout?.textOverrides?.["t:team:badge"] || "ทีมงาน";
  const title = layout?.textOverrides?.["t:team:title"] || "ทีมงานและบุคลากรขนส่งมืออาชีพ";
  const subtitle =
    layout?.textOverrides?.["t:team:subtitle"] ||
    "ขับเคลื่อนทุกการขนส่งด้วยความปลอดภัย ซื่อสัตย์ และตรงต่อเวลา ผ่านการอบรมและตรวจประวัติอาชญากรรมอย่างเข้มงวด";

  const teams = [
    { id: "t1", name: "ทีมคนขับสายหลัก", en: "Linehaul Drivers", role: "ชำนาญเส้นทางข้ามภาค วิ่งงาน KEX Express", stat: "10+ ปี" },
    { id: "t2", name: "ศูนย์ควบคุมเดินรถ", en: "Dispatch Center", role: "ติดตาม GPS และความเร็วรถทุกคัน", stat: "24 ชม." },
    { id: "t3", name: "ทีมคลังและโหลดสินค้า", en: "Cargo Handling", role: "ตรวจนับ จัดเรียง รัดสินค้ากันกระแทก", stat: "ทุกเที่ยว" },
    { id: "t4", name: "ฝ่ายบริการลูกค้า", en: "Customer Support", role: "ประสานงานและแก้ปัญหาเฉพาะหน้า", stat: "7 วัน" },
  ];

  return (
    <section id="team" className="py-20 sm:py-28 bg-paper-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={<Editable field="t:team:badge" value={badge} noTransform />}
          title={<Editable field="t:team:title" value={title} noTransform />}
          intro={<Editable field="t:team:subtitle" value={subtitle} multiline noTransform />}
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          <figure className="lg:col-span-7">
            <div className="relative aspect-[4/3] bg-ink overflow-hidden">
              <Image
                src="/images/thai_transport_loading.jpg"
                alt="ทีมงาน 5 August Transport กำลังโหลดสินค้าขึ้นรถที่คลังสินค้า"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted">ทีมโหลดสินค้า ณ ศูนย์กระจายสินค้า บางพลี สมุทรปราการ</figcaption>
          </figure>

          <div className="lg:col-span-5 flex flex-col">
            <ul className="border-t border-ink">
              {teams.map((m) => (
                <li key={m.id} className="py-5 border-b border-line grid grid-cols-[1fr_auto] gap-4 items-baseline">
                  <div>
                    <h3 className="text-lg text-ink font-medium">{m.name}</h3>
                    <p className="eyebrow text-muted mt-0.5 normal-case tracking-normal">{m.en}</p>
                    <p className="mt-2 text-sm text-ink-soft">{m.role}</p>
                  </div>
                  <span className="font-mono text-sm text-brand tabular">{m.stat}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              <a
                href={`tel:${phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 h-12 px-5 bg-ink hover:bg-brand text-paper font-medium transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden />
                โทรหาทีมงาน
              </a>
              <a
                href={`https://line.me/R/ti/p/${lineId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-5 border border-ink text-ink hover:bg-[#06C755] hover:border-[#06C755] hover:text-white font-medium transition-colors"
              >
                <MessageSquare className="w-4 h-4" aria-hidden />
                แชท LINE
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

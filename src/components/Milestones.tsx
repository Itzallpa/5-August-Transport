import { COMPANY_MILESTONES } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";

import type { SiteLayout } from "@/lib/site-layout";
import { Editable } from "@/components/editor/EditorContext";

type MilestoneItem = {
  id?: string;
  year: string;
  title: string;
  description: string;
  tag?: string | null;
};

export default function Milestones({
  milestones,
  layout,
}: {
  milestones?: MilestoneItem[];
  layout?: SiteLayout;
}) {
  const displayMilestones: MilestoneItem[] =
    milestones && milestones.length > 0 ? milestones : COMPANY_MILESTONES;

  const badge = layout?.textOverrides?.["t:milestones:badge"] || "เส้นทางการเติบโตของเรา";
  const title = layout?.textOverrides?.["t:milestones:title"] || "ก้าวสำคัญและความสำเร็จ (Company Milestones)";
  const subtitle =
    layout?.textOverrides?.["t:milestones:subtitle"] ||
    "จากจุดเริ่มต้นสู่วันนี้ บริษัท 5 สิงหา ทรานสปอร์ต จำกัด ไม่เคยหยุดพัฒนา เพื่อสร้างรากฐานโลจิสติกส์ที่แข็งแกร่งและไว้วางใจได้";

  return (
    <section id="milestones" className="py-20 sm:py-28 bg-ink text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          label={<Editable field="t:milestones:badge" value={badge} noTransform />}
          title={<Editable field="t:milestones:title" value={title} noTransform />}
          intro={<Editable field="t:milestones:subtitle" value={subtitle} multiline noTransform />}
        />

        <ol className="border-t border-line-dark">
          {displayMilestones.map((item, index) => (
            <li
              key={item.id || item.year + index}
              className="grid grid-cols-12 gap-x-6 gap-y-2 py-8 border-b border-line-dark"
            >
              <p className="col-span-12 md:col-span-3 font-mono text-4xl sm:text-5xl tabular tracking-tight text-paper">
                {item.year}
              </p>
              <div className="col-span-12 md:col-span-6">
                <h3 className="text-xl font-medium">{item.title}</h3>
                <p className="mt-2 text-paper/70 leading-relaxed">{item.description}</p>
              </div>
              {item.tag && (
                <p className="col-span-12 md:col-span-3 md:text-right eyebrow text-paper/50 md:pt-2">{item.tag}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

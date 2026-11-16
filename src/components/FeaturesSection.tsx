import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SiteLayout } from "@/lib/site-layout";
import { Editable, ImageEditButton } from "@/components/editor/EditorContext";
import { COMPANY_INFO } from "@/lib/constants";

export default function FeaturesSection({
  content,
  layout,
}: {
  content?: Partial<SiteContentData>;
  layout?: SiteLayout;
}) {
  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const featureImage = layout?.textOverrides?.["t:features:image"] || "/images/thai_transport_fleet_yard.jpg";
  const badge = layout?.textOverrides?.["t:features:badge"] || "ทำไมต้องเรา";
  const title = layout?.textOverrides?.["t:features:title"] || "เร็ว ปลอดภัย และตรวจสอบได้ทุกเที่ยว";
  const subtitle =
    layout?.textOverrides?.["t:features:subtitle"] ||
    "บริษัท 5 สิงหา ทรานสปอร์ต จำกัด มุ่งมั่นส่งมอบบริการขนส่งสินค้าและโลจิสติกส์ที่รวดเร็ว ปลอดภัย และตรงต่อเวลา เพื่อสนับสนุนการเติบโตอย่างยั่งยืนของธุรกิจคุณ พร้อมระบบบริหารจัดการกองยานพาหนะทันสมัย";

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
    <section id="features" className="bg-ink text-paper">
      <div className="grid lg:grid-cols-2">
        {/* Photo, bleeding to the viewport edge */}
        <div className="relative min-h-[360px] lg:min-h-full">
          <Image
            src={featureImage}
            alt="รถขนส่ง 5 August Transport พร้อมระบบ GPS"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <ImageEditButton field="t:features:image" label="เปลี่ยนรูปภาพ" className="absolute top-3 right-3 z-30" />
        </div>

        <div className="px-4 sm:px-8 lg:px-16 py-20 sm:py-24 lg:max-w-[680px]">
          <div className="flex items-center gap-4 border-t border-line-dark pt-4 eyebrow text-paper/60">
            <span className="sec-index text-paper" aria-hidden />
            <Editable field="t:features:badge" value={badge} noTransform />
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            <Editable field="t:features:title" value={title} noTransform />
          </h2>
          <p className="mt-6 text-paper/70 leading-relaxed">
            <Editable field="t:features:subtitle" value={subtitle} multiline noTransform />
          </p>

          <ol className="mt-10 border-t border-line-dark">
            {features.map((f, i) => {
              const [th, en] = splitTitle(f.title);
              return (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] py-5 border-b border-line-dark">
                  <span className="font-mono text-sm text-brand tabular pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-lg font-medium">{th}</h3>
                    {en && <p className="eyebrow text-paper/45 mt-1 normal-case tracking-normal">{en}</p>}
                    <p className="mt-2 text-sm text-paper/70 leading-relaxed">{f.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#quote"
              className="inline-flex items-center gap-2 h-12 px-6 bg-brand hover:bg-brand-deep text-white font-medium transition-colors"
            >
              เช็คราคาขนส่ง
              <ArrowRight className="w-4 h-4" aria-hidden />
            </a>
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center gap-2 h-12 px-6 border border-paper/30 hover:border-paper font-mono text-sm tabular transition-colors"
            >
              <Phone className="w-4 h-4" aria-hidden />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** "English Title (ชื่อไทย)" → ["ชื่อไทย", "English Title"] */
function splitTitle(t: string): [string, string] {
  const m = t.match(/^(.*?)\s*\((.+)\)\s*$/);
  return m ? [m[2], m[1]] : [t, ""];
}

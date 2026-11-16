import { Clock, ShieldCheck, Coins, Truck, Users, MapPin, Award, Star, Heart, Zap } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { KEY_SELLING_POINTS } from "@/lib/constants";
import type { ValueItem } from "@/lib/site-layout";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { Editable, Movable } from "@/components/editor/EditorContext";

const ICON_MAP = {
  Clock: Clock,
  ShieldCheck: ShieldCheck,
  Coins: Coins,
  Truck: Truck,
  Users: Users,
  MapPin: MapPin,
  Award: Award,
  Star: Star,
  Heart: Heart,
  Zap: Zap,
};

export default function ValueProps({ content, items }: { content?: Partial<SiteContentData>; items?: ValueItem[] }) {
  const valueItems = items ?? KEY_SELLING_POINTS;
  const valueBadge = content?.valueBadge || "จุดเด่นและมาตรฐานการบริการ";
  const valueTitle = content?.valueTitle || "ทำไมธุรกิจชั้นนำจึงไว้วางใจ";
  const valueTitleHighlight = content?.valueTitleHighlight || "5 August Transport";
  const valueSubtitle = content?.valueSubtitle || "เรามุ่งมั่นพัฒนาคุณภาพการบริการอย่างต่อเนื่อง ทั้งด้านกองยานพาหนะ บุคลากร และเทคโนโลยี เพื่อส่งมอบความมั่นใจสูงสุดให้แก่ลูกค้าทุกท่าน";

  return (
    <section id="strengths" className="py-20 sm:py-28 bg-paper-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={
            <Movable field="valueBadgeBox" as="span">
              <Editable field="valueBadge" value={valueBadge} noTransform />
            </Movable>
          }
          title={
            <Movable field="valueTitleBox" as="span">
              <Editable field="valueTitle" value={valueTitle} noTransform />{" "}
              <span className="text-brand">
                <Editable field="valueTitleHighlight" value={valueTitleHighlight} noTransform />
              </span>
            </Movable>
          }
          intro={
            <Movable field="valueSubtitleBox" as="span">
              <Editable field="valueSubtitle" value={valueSubtitle} multiline noTransform />
            </Movable>
          }
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border-y border-line">
          {valueItems.map((item, i) => {
            const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP] || Truck;
            return (
              <div
                key={item.id}
                className="bg-paper-2 py-8 sm:px-8"
              >
                <div className="flex items-center justify-between">
                  <IconComponent className="w-6 h-6 text-brand" strokeWidth={1.5} aria-hidden />
                  <span className="font-mono text-xs text-muted tabular">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 text-xl text-ink font-medium">{item.titleTh}</h3>
                <p className="mt-3 text-sm text-ink-soft leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

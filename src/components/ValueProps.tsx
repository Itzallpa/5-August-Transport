import { Clock, ShieldCheck, Coins, Truck, Users, MapPin, CheckCircle2, Award, Star, Heart, Zap } from "lucide-react";
import { KEY_SELLING_POINTS } from "@/lib/constants";
import type { ValueItem } from "@/lib/site-layout";
import type { SiteContentData } from "@/app/actions/site-content-actions";

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
    <section id="strengths" className="py-20 bg-white text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#D32F2F] border border-red-200 text-xs font-bold tracking-wider uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{valueBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {valueTitle} <span className="text-[#D32F2F]">{valueTitleHighlight}</span>
          </h2>

          <p className="text-slate-600 text-base font-normal leading-relaxed">
            {valueSubtitle}
          </p>
        </div>

        {/* 6 Key Selling Points - Organic, Human-Designed & Friendly Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueItems.map((item) => {
            const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP] || Truck;
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#D32F2F] transition-colors">
                        {item.titleTh}
                      </h3>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-emerald-200/60">
                        ✓ มาตรฐานบริการจริง
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>มีคนช่วยยกและประสานงาน</span>
                  </span>
                  <span className="text-[#D32F2F] font-bold">5 August Care</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

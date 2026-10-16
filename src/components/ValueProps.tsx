import { Clock, ShieldCheck, Coins, Truck, Users, MapPin } from "lucide-react";
import { KEY_SELLING_POINTS } from "@/lib/constants";

const ICON_MAP = {
  Clock: Clock,
  ShieldCheck: ShieldCheck,
  Coins: Coins,
  Truck: Truck,
  Users: Users,
  MapPin: MapPin,
};

export default function ValueProps() {
  return (
    <section id="strengths" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-red-400 text-xs font-semibold tracking-wider uppercase">
            จุดเด่นและมาตรฐานการบริการ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ทำไมธุรกิจชั้นนำจึงไว้วางใจ <br />
            <span className="text-[#D32F2F]">
              5 August Transport
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            เรามุ่งมั่นพัฒนาคุณภาพการบริการอย่างต่อเนื่อง ทั้งด้านกองยานพาหนะ บุคลากร และเทคโนโลยี เพื่อส่งมอบความมั่นใจสูงสุดให้แก่ลูกค้าทุกท่าน
          </p>
        </div>

        {/* 6 Key Selling Points Grid - Refactored without AI icon box template */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {KEY_SELLING_POINTS.map((item, index) => {
            const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP] || Truck;
            return (
              <div
                key={item.id}
                className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 relative"
              >
                {/* Number indicator */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-6 h-6 text-[#D32F2F] shrink-0" />
                    <h3 className="text-xl font-bold text-white">
                      {item.titleTh}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    0{index + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-red-400 tracking-wider block">
                    {item.titleEn}
                  </span>

                  <p className="text-slate-300 text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

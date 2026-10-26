import Image from "next/image";
import { Phone, MessageSquare, ShieldCheck, Truck } from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { COMPANY_INFO } from "@/lib/constants";

export default function DeliveryTeamSection({ content }: { content?: Partial<SiteContentData> }) {
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const lineId = content?.lineId || COMPANY_INFO.lineId;

  const teamMembers = [
    {
      id: "t1",
      name: "ทีมคนขับสายหลัก (Linehaul Drivers)",
      role: "ผู้เชี่ยวชาญเส้นทางข้ามภาค KEX Express",
      image: "/images/faster/team-1.jpg",
      badge: "ประสบการณ์ 10+ ปี",
    },
    {
      id: "t2",
      name: "ศูนย์ควบคุมเดินรถ (Dispatch Center)",
      role: "ติดตาม GPS & ตรวจสอบความเร็ว 24 ชม.",
      image: "/images/faster/team-2.jpg",
      badge: "ความปลอดภัย 100%",
    },
    {
      id: "t3",
      name: "ทีมงานคลังและโหลดสินค้า (Cargo Staging)",
      role: "ตรวจนับและจัดเรียงพัสดุป้องกันการกระแทก",
      image: "/images/faster/team-3.jpg",
      badge: "มาตรฐานคลังสากล",
    },
    {
      id: "t4",
      name: "ฝ่ายบริการลูกค้า & สนับสนุนฉุกเฉิน",
      role: "ประสานงานแก้ไขปัญหาเฉพาะหน้า 24 ชม.",
      image: "/images/faster/team-4.jpg",
      badge: "พร้อมดูแล 24/7",
    },
  ];

  return (
    <section id="team" className="py-20 sm:py-24 bg-[#F2F2F4] text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h6 className="text-[#D32F2F] text-xs sm:text-sm font-black uppercase tracking-widest mb-2 font-mono">
            DELIVERY TEAM
          </h6>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            ทีมงานและบุคลากรขนส่งมืออาชีพ
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            ขับเคลื่อนทุกการขนส่งด้วยความปลอดภัย ซื่อสัตย์ และตรงต่อเวลา ผ่านการอบรมและตรวจประวัติอาชญากรรมอย่างเข้มงวด
          </p>
        </div>

        {/* Team Grid in FASTER style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((m) => (
            <div
              key={m.id}
              className="team-card bg-white rounded-lg overflow-hidden border border-slate-200 shadow hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Photo */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#1F1F2E] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {m.badge}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 text-center bg-white relative z-10 border-t border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base leading-tight mb-1">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {m.role}
                </p>
              </div>

              {/* Hover Social / Contact Bar in Primary Red */}
              <div className="team-social bg-[#D32F2F] text-white p-3 flex items-center justify-center gap-3">
                <a
                  href={`tel:${phoneRaw}`}
                  className="w-8 h-8 rounded-full bg-white text-[#D32F2F] flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
                  title="โทรติดต่อ"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://line.me/ti/p/~${lineId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#06C755] text-white flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
                  title="ติดต่อ LINE"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { COMPANY_MILESTONES } from "@/lib/constants";
import { Sparkles, CheckCircle2 } from "lucide-react";

type MilestoneItem = {
  id?: string;
  year: string;
  title: string;
  description: string;
  tag?: string | null;
};

export default function Milestones({
  milestones,
}: {
  milestones?: MilestoneItem[];
}) {
  const displayMilestones: MilestoneItem[] =
    milestones && milestones.length > 0 ? milestones : COMPANY_MILESTONES;


  return (
    <section id="milestones" className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>เส้นทางการเติบโตของเรา</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            ก้าวสำคัญและความสำเร็จ (Company Milestones)
          </h2>

          <p className="text-slate-300 text-base max-w-2xl mx-auto font-light leading-relaxed">
            จากจุดเริ่มต้นสู่วันนี้ บริษัท 5 สิงหา ทรานสปอร์ต จำกัด ไม่เคยหยุดพัฒนา เพื่อสร้างรากฐานโลจิสติกส์ที่แข็งแกร่งและไว้วางใจได้
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-red-600 to-slate-700 sm:-translate-x-1/2" />

          <div className="space-y-12">
            {displayMilestones.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id || item.year + index}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Center Node / Dot */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-4 border-[#D32F2F] shadow-md shadow-black/30 flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  {/* Content Box */}
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8">
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 group">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-[#D32F2F] text-white shadow-sm font-mono">
                          {item.year}
                        </span>
                        {item.tag && (
                          <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-2">
                        {item.title}
                      </h3>

                      <p className="text-slate-300 text-sm font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { COMPANY_MILESTONES } from "@/lib/constants";
import { Sparkles, CheckCircle2, Calendar } from "lucide-react";

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
    <section id="milestones" className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#D32F2F] border border-red-200 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>เส้นทางการเติบโตของเรา</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ก้าวสำคัญและความสำเร็จ (Company Milestones)
          </h2>

          <p className="text-slate-600 text-base max-w-2xl mx-auto font-normal leading-relaxed">
            จากจุดเริ่มต้นสู่วันนี้ บริษัท 5 สิงหา ทรานสปอร์ต จำกัด ไม่เคยหยุดพัฒนา เพื่อสร้างรากฐานโลจิสติกส์ที่แข็งแกร่งและไว้วางใจได้
          </p>
        </div>

        {/* Vertical Timeline - Clean Corporate Style */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-slate-300 sm:-translate-x-1/2" />

          <div className="space-y-10">
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
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-[#D32F2F] shadow-sm flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-[#D32F2F]" />
                  </div>

                  {/* Content Box - Classic Bootstrap Card */}
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8">
                    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#D32F2F] text-white">
                          ปี {item.year}
                        </span>
                        {item.tag && (
                          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {item.title}
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed">
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

import Image from "next/image";
import { Truck, Package, Navigation, Users, Check, ArrowRight, PhoneCall, ShieldCheck } from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SolutionCard, SolutionsHeader } from "@/lib/site-layout";
import { DEFAULT_SOLUTION_CARDS, DEFAULT_SOLUTIONS_HEADER } from "@/lib/site-layout";
import { Editable, ImageEditButton } from "@/components/editor/EditorContext";

const MINI_ICONS = [Truck, Package, Navigation, Users];

export default function PlatformSolutions({
  header = DEFAULT_SOLUTIONS_HEADER,
  cards = DEFAULT_SOLUTION_CARDS,
}: {
  content?: Partial<SiteContentData>;
  header?: SolutionsHeader;
  cards?: SolutionCard[];
}) {
  return (
    <section
      id="solutions"
      className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-[#D32F2F] border border-red-200 text-xs font-black uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-[#D32F2F]" />
            <Editable field="solution:header:badge" value={header.badge} noTransform />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            <Editable field="solution:header:title" value={header.title} noTransform />
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            <Editable field="solution:header:subtitle" value={header.subtitle} multiline noTransform />
          </p>
        </div>

        {/* Top summary cards over map */}
        <div className="relative mb-20 sm:mb-28">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none overflow-hidden">
            <svg viewBox="0 0 1000 500" className="w-full h-full text-slate-900" fill="currentColor">
              <path d="M150,120 Q220,90 280,140 T420,130 T550,180 T700,120 T850,170 T950,220 Q920,320 800,340 T650,380 T500,350 T350,420 T200,380 T100,280 Z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {cards.slice(0, 4).map((c, i) => {
              const Icon = MINI_ICONS[i % MINI_ICONS.length];
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200 hover:border-red-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group"
                >
                  <a
                    href={`#${c.id}`}
                    className="w-16 h-16 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm"
                    aria-label={c.title}
                  >
                    <Icon className="w-8 h-8" />
                  </a>
                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    <Editable field={`solution:${c.id}:title`} value={c.title} noTransform />
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    <Editable field={`solution:${c.id}:summary`} value={c.summary} multiline noTransform />
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alternating detail cards */}
        <div className="space-y-8 sm:space-y-12">
          {cards.map((c, i) => (
            <div
              key={c.id}
              id={c.id}
              className={`bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col ${
                i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center justify-between gap-8 sm:gap-12 group scroll-mt-24`}
            >
              <div className="space-y-5 max-w-xl w-full">
                <span className="inline-block text-xs font-black uppercase text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  <Editable field={`solution:${c.id}:tag`} value={c.tag} noTransform />
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  <Editable field={`solution:${c.id}:title`} value={c.title} noTransform />
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  <Editable field={`solution:${c.id}:description`} value={c.description} multiline noTransform />
                </p>

                <ul className="space-y-3 pt-2">
                  {c.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                      <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>
                        <Editable field={`solution:${c.id}:bullet:${bi}`} value={b} noTransform />
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  {c.buttonLabel && (
                    <a
                      href={c.buttonHref}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all hover:scale-105 active:scale-95"
                    >
                      <Editable field={`solution:${c.id}:buttonLabel`} value={c.buttonLabel} noTransform />
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                  {c.secondaryLabel && (
                    <a
                      href={c.secondaryHref}
                      className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                    >
                      <PhoneCall className="w-4 h-4 text-[#D32F2F]" />
                      <Editable field={`solution:${c.id}:secondaryLabel`} value={c.secondaryLabel} noTransform />
                    </a>
                  )}
                </div>
              </div>

              {/* Visual */}
              <div className="relative w-full lg:w-[420px] shrink-0 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md group-hover:shadow-xl transition-all">
                <div className="relative h-64 sm:h-72 w-full bg-white">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 420px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">ยังไม่มีรูป</div>
                  )}
                  <ImageEditButton field={`solution:${c.id}:image`} label="เปลี่ยนรูปภาพ" className="absolute top-3 left-3 z-30" />
                </div>
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#D32F2F] shrink-0" />
                    <Editable field={`solution:${c.id}:imageCaption`} value={c.imageCaption} noTransform />
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#D32F2F] font-bold">
                    <Editable field={`solution:${c.id}:imageBadge`} value={c.imageBadge} noTransform />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

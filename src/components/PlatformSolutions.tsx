import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SolutionCard, SolutionsHeader } from "@/lib/site-layout";
import { DEFAULT_SOLUTION_CARDS, DEFAULT_SOLUTIONS_HEADER } from "@/lib/site-layout";
import { Editable, ImageEditButton } from "@/components/editor/EditorContext";
import SectionHeading from "@/components/ui/SectionHeading";

export default function PlatformSolutions({
  header = DEFAULT_SOLUTIONS_HEADER,
  cards = DEFAULT_SOLUTION_CARDS,
}: {
  content?: Partial<SiteContentData>;
  header?: SolutionsHeader;
  cards?: SolutionCard[];
}) {
  return (
    <section id="solutions" className="py-20 sm:py-28 bg-paper border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={<Editable field="solution:header:badge" value={header.badge} noTransform />}
          title={<Editable field="solution:header:title" value={header.title} noTransform />}
          intro={<Editable field="solution:header:subtitle" value={header.subtitle} multiline noTransform />}
        />

        {/* Index of vehicle types */}
        <nav aria-label="ประเภทรถ" className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-ink">
          {cards.slice(0, 4).map((c, i) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={`group py-5 sm:pr-6 border-b border-line ${i > 0 ? "lg:border-l lg:pl-6" : ""} ${i % 2 === 1 ? "sm:border-l sm:pl-6" : ""} hover:bg-paper-2 transition-colors`}
            >
              <span className="font-mono text-xs text-muted tabular">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-ink font-medium group-hover:text-brand transition-colors">
                <Editable field={`solution:${c.id}:title`} value={c.title} noTransform />
              </h3>
              <p className="mt-1 text-sm text-muted leading-relaxed line-clamp-2">
                <Editable field={`solution:${c.id}:summary`} value={c.summary} multiline noTransform />
              </p>
            </a>
          ))}
        </nav>

        {/* Detail rows */}
        <div className="mt-16 sm:mt-24 space-y-20 sm:space-y-28">
          {cards.map((c, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={c.id} id={c.id} className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center scroll-mt-28">
                <figure className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-paper-2 overflow-hidden">
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-sm">ยังไม่มีรูป</div>
                    )}
                    <ImageEditButton field={`solution:${c.id}:image`} label="เปลี่ยนรูปภาพ" className="absolute top-3 left-3 z-30" />
                  </div>
                  <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                    <span className="text-ink">
                      <Editable field={`solution:${c.id}:imageCaption`} value={c.imageCaption} noTransform />
                    </span>
                    <span className="font-mono text-xs text-muted">
                      <Editable field={`solution:${c.id}:imageBadge`} value={c.imageBadge} noTransform />
                    </span>
                  </figcaption>
                </figure>

                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <p className="eyebrow text-brand">
                    <Editable field={`solution:${c.id}:tag`} value={c.tag} noTransform />
                  </p>
                  <h3 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                    <Editable field={`solution:${c.id}:title`} value={c.title} noTransform />
                  </h3>
                  <p className="mt-5 text-ink-soft leading-relaxed">
                    <Editable field={`solution:${c.id}:description`} value={c.description} multiline noTransform />
                  </p>

                  <ul className="mt-6 border-t border-line">
                    {c.bullets.map((b, bi) => (
                      <li key={bi} className="py-3 border-b border-line text-sm text-ink flex gap-3">
                        <span className="font-mono text-xs text-muted tabular pt-0.5 w-5 shrink-0">{bi + 1}</span>
                        <Editable field={`solution:${c.id}:bullet:${bi}`} value={b} noTransform />
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {c.buttonLabel && (
                      <a
                        href={c.buttonHref}
                        className="inline-flex items-center gap-2 h-12 px-6 bg-ink hover:bg-brand text-paper font-medium transition-colors"
                      >
                        <Editable field={`solution:${c.id}:buttonLabel`} value={c.buttonLabel} noTransform />
                        <ArrowRight className="w-4 h-4" aria-hidden />
                      </a>
                    )}
                    {c.secondaryLabel && (
                      <a
                        href={c.secondaryHref}
                        className="inline-flex items-center gap-2 text-ink font-medium underline underline-offset-4 decoration-line hover:decoration-ink"
                      >
                        <Phone className="w-4 h-4 text-brand" aria-hidden />
                        <Editable field={`solution:${c.id}:secondaryLabel`} value={c.secondaryLabel} noTransform />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

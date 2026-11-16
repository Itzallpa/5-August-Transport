import type { ReactNode } from "react";

/**
 * Section numbers come from a CSS counter on <main> (see .sec-index in globals.css),
 * so they stay correct when sections are reordered or hidden in the builder.
 *
 * Editorial section header: hairline rule, mono index + label on the left,
 * a large headline, and an optional intro paragraph that sits in its own column.
 */
export default function SectionHeading({
  label,
  title,
  intro,
  tone = "light",
  className = "",
}: {
  /** @deprecated numbering is automatic */
  index?: string;
  label: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <header className={`mb-12 sm:mb-16 ${className}`}>
      <div
        className={`flex items-center gap-4 border-t pt-4 eyebrow ${
          dark ? "border-line-dark text-paper/60" : "border-ink text-muted"
        }`}
      >
        <span className={`sec-index ${dark ? "text-paper" : "text-ink"}`} aria-hidden />
        <span>{label}</span>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:gap-12 items-end">
        <h2
          className={`lg:col-span-8 text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.2] font-semibold tracking-tight ${
            dark ? "text-paper" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {intro && (
          <p
            className={`lg:col-span-4 text-base leading-relaxed ${
              dark ? "text-paper/70" : "text-ink-soft"
            }`}
          >
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}

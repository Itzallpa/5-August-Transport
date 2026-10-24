import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomBlockView from "@/components/home/CustomBlockView";
import { buildBuiltinSections, type MilestoneRow } from "@/components/home/builtinSections";
import { prisma } from "@/lib/prisma";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { parseLayout, BLOCK_KEY_PREFIX, type SectionKey } from "@/lib/site-layout";
import { Fragment } from "react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let milestones: MilestoneRow[] = [];
  let content: Partial<SiteContentData> | null = null;

  try {
    const [fetchedMilestones, fetchedContent] = await Promise.all([
      prisma.milestone.findMany({
        where: { isActive: true },
        orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
      }),
      prisma.siteContent.findUnique({
        where: { id: "default" },
      }),
    ]);

    milestones = fetchedMilestones;
    content = fetchedContent;
  } catch (error) {
    console.error("Failed to load content for homepage:", error);
  }

  const layout = parseLayout(content?.layoutJson);
  const c = content ?? undefined;
  const builtin = buildBuiltinSections(c, layout, milestones);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-[#D32F2F] selection:text-white">
      {/* Global Navigation Bar */}
      <Navbar content={c} navLinks={layout.navLinks} />

      <main className="flex-1">
        {layout.sections
          .filter((s) => {
            if (!s.visible) return false;
            // The Figma template in 'solutions' already provides the full fleet & services.
            // Filter out legacy bloated sections to keep the landing page clean and authentic.
            if (["about", "fleet", "values", "gallery", "milestones"].includes(s.key)) {
              return false;
            }
            return true;
          })
          .map((s) => {
            if (s.key.startsWith(BLOCK_KEY_PREFIX)) {
              const block = layout.customBlocks.find((b) => b.id === s.key.slice(BLOCK_KEY_PREFIX.length));
              return block ? <CustomBlockView key={s.key} block={block} /> : null;
            }
            return <Fragment key={s.key}>{builtin[s.key as SectionKey]}</Fragment>;
          })}
      </main>

      {/* Corporate Footer */}
      <Footer content={c} />
    </div>
  );
}

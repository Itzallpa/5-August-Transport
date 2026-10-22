import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import FleetSection from "@/components/FleetSection";
import GallerySection from "@/components/GallerySection";
import QuoteCalculator from "@/components/QuoteCalculator";
import AboutSection from "@/components/AboutSection";
import Milestones from "@/components/Milestones";
import DriverRecruitmentForm from "@/components/DriverRecruitmentForm";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { parseLayout, type SectionKey } from "@/lib/site-layout";
import { Fragment, type ReactNode } from "react";

type Milestone = {
  id: string;
  year: string;
  title: string;
  description: string;
  tag?: string | null;
  orderIndex?: number;
  isActive?: boolean;
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let milestones: Milestone[] = [];
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

  // Each homepage block, keyed so the admin can reorder / hide them.
  const renderers: Record<SectionKey, () => ReactNode> = {
    hero: () => <Hero content={c} />,
    about: () => <AboutSection content={c} />,
    fleet: () => <FleetSection content={c} items={layout.fleetItems} />,
    gallery: () => <GallerySection items={layout.galleryItems} />,
    values: () => <ValueProps content={c} items={layout.valueItems} />,
    quote: () => <QuoteCalculator content={c} rates={layout.quoteRates} />,
    milestones: () => <Milestones milestones={milestones} />,
    recruitment: () => <DriverRecruitmentForm content={c} />,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-[#D32F2F] selection:text-white">
      {/* Global Navigation Bar */}
      <Navbar content={c} navLinks={layout.navLinks} />

      <main className="flex-1">
        {layout.sections
          .filter((s) => s.visible)
          .map((s) => (
            <Fragment key={s.key}>{renderers[s.key]()}</Fragment>
          ))}
      </main>

      {/* Corporate Footer */}
      <Footer content={c} />
    </div>
  );
}



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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-[#D32F2F] selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar content={content ?? undefined} />

      <main className="flex-1">
        {/* 2. Hero Section - Authentic Thai Transport Banner */}
        <Hero content={content ?? undefined} />

        {/* 3. About Us & Company Background */}
        <AboutSection content={content ?? undefined} />

        {/* 4. Fleet & Vehicle Catalog (7 Vehicle Categories) */}
        <FleetSection content={content ?? undefined} />

        {/* 5. Real Transport Operations Gallery */}
        <GallerySection />

        {/* 6. Key Value Propositions (Friendly & Human-Crafted) */}
        <ValueProps content={content ?? undefined} />

        {/* 7. Freight Cost Estimator / Quick Quote Tool */}
        <QuoteCalculator content={content ?? undefined} />

        {/* 8. Milestones & Timeline */}
        <Milestones milestones={milestones} />

        {/* 9. Driver Recruitment Application Form */}
        <DriverRecruitmentForm content={content ?? undefined} />
      </main>

      {/* 10. Corporate Footer */}
      <Footer content={content ?? undefined} />
    </div>
  );
}



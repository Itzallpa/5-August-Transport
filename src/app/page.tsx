import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import FleetSection from "@/components/FleetSection";
import QuoteCalculator from "@/components/QuoteCalculator";
import AboutSection from "@/components/AboutSection";
import Milestones from "@/components/Milestones";
import DriverRecruitmentForm from "@/components/DriverRecruitmentForm";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import type { Milestone, SiteContent } from "@prisma/client";


export const dynamic = "force-dynamic";

export default async function HomePage() {
  let milestones: Milestone[] = [];
  let content: SiteContent | null = null;

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-[#D32F2F] selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar content={content ?? undefined} />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero content={content ?? undefined} />

        {/* 3. Key Value Propositions (6 Strengths with Icons) */}
        <ValueProps />

        {/* 4. Fleet & Services Showcase (7 Vehicle Categories) */}
        <FleetSection />

        {/* 5. Freight Cost Estimator / Quick Quote Tool */}
        <QuoteCalculator content={content ?? undefined} />

        {/* 6. About Us & Company Background */}
        <AboutSection content={content ?? undefined} />

        {/* 7. Milestones & Timeline */}
        <Milestones milestones={milestones} />

        {/* 8. Driver Recruitment Application Form */}
        <DriverRecruitmentForm content={content ?? undefined} />
      </main>

      {/* 9. Corporate Footer */}
      <Footer content={content ?? undefined} />
    </div>
  );
}



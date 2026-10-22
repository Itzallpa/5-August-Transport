import type { ReactNode } from "react";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import FleetSection from "@/components/FleetSection";
import GallerySection from "@/components/GallerySection";
import QuoteCalculator from "@/components/QuoteCalculator";
import AboutSection from "@/components/AboutSection";
import Milestones from "@/components/Milestones";
import DriverRecruitmentForm from "@/components/DriverRecruitmentForm";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import type { SectionKey, SiteLayout } from "@/lib/site-layout";

export type MilestoneRow = {
  id: string;
  year: string;
  title: string;
  description: string;
  tag?: string | null;
  orderIndex?: number;
  isActive?: boolean;
};

/** The ready-made homepage blocks, shared by the public page and the visual editor. */
export function buildBuiltinSections(
  content: Partial<SiteContentData> | undefined,
  layout: SiteLayout,
  milestones: MilestoneRow[]
): Record<SectionKey, ReactNode> {
  return {
    hero: <Hero content={content} />,
    about: <AboutSection content={content} />,
    fleet: <FleetSection content={content} items={layout.fleetItems} />,
    gallery: <GallerySection items={layout.galleryItems} />,
    values: <ValueProps content={content} items={layout.valueItems} />,
    quote: <QuoteCalculator content={content} rates={layout.quoteRates} />,
    milestones: <Milestones milestones={milestones} />,
    recruitment: <DriverRecruitmentForm content={content} />,
  };
}

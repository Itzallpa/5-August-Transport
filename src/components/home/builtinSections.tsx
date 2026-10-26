import type { ReactNode } from "react";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import QuoteCalculator from "@/components/QuoteCalculator";
import ServicesSection from "@/components/ServicesSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import PlatformSolutions from "@/components/PlatformSolutions";
import DeliveryTeamSection from "@/components/DeliveryTeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DriverRecruitmentForm from "@/components/DriverRecruitmentForm";
import GallerySection from "@/components/GallerySection";
import ValueProps from "@/components/ValueProps";
import Milestones from "@/components/Milestones";
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
    quote: <QuoteCalculator content={content} rates={layout.quoteRates} />,
    services: <ServicesSection content={content} />,
    features: <FeaturesSection content={content} />,
    pricing: <PricingSection content={content} />,
    solutions: <PlatformSolutions content={content} header={layout.solutionsHeader} cards={layout.solutionCards} />,
    team: <DeliveryTeamSection content={content} />,
    testimonials: <TestimonialsSection content={content} />,
    recruitment: <DriverRecruitmentForm content={content} />,
    gallery: <GallerySection items={layout.galleryItems} />,
    values: <ValueProps content={content} items={layout.valueItems} />,
    milestones: <Milestones milestones={milestones} />,
  };
}

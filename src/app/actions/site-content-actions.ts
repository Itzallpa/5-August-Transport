"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/security";
import { parseLayout } from "@/lib/site-layout";

export type SiteContentData = {
  // 1. Company & Contact Info
  nameTh: string;
  nameEn: string;
  shortName: string;
  slogan: string;
  subSlogan: string;
  trustedTagline: string;
  phone: string;
  phoneRaw: string;
  lineId: string;
  email: string;
  address: string;
  operatingHours: string;
  logoUrl?: string | null;

  // 2. Hero Section
  heroImageUrl: string;
  heroBadge: string;
  heroHeading: string;
  heroHeadingHighlight: string;
  heroSubheading: string;
  heroCtaDriverText: string;
  heroCtaFleetText: string;
  heroStat1Label: string;
  heroStat1Value: string;
  heroStat2Label: string;
  heroStat2Value: string;
  heroStat3Label: string;
  heroStat3Value: string;
  heroStat4Label: string;
  heroStat4Value: string;

  // 3. Value Props (จุดเด่น 6 ประการ)
  valueBadge: string;
  valueTitle: string;
  valueTitleHighlight: string;
  valueSubtitle: string;

  // 4. Fleet Section (กองยานพาหนะ)
  fleetImageUrl: string;
  fleetBadge: string;
  fleetTitle: string;
  fleetSubtitle: string;
  fleetBannerTag: string;
  fleetBannerTitle: string;
  fleetBannerSubtitle: string;

  // 5. Quote Section
  quoteTitle: string;
  quoteSubtitle: string;
  quoteNotice: string;

  // 6. About Section
  aboutImageUrl: string;
  aboutBadge: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutStory1: string;
  aboutStory2: string;
  aboutVision: string;
  aboutMission: string;
  aboutRegisteredCapital: string;
  aboutOperationsBadge: string;
  aboutOperationsSub: string;
  aboutExpYears: string;
  aboutExpText: string;

  // 7. Recruitment Section
  recruitBadge: string;
  recruitTitle: string;
  recruitSubtitle: string;
  recruitIncomeHighlight: string;
  recruitBenefit1: string;
  recruitBenefit2: string;
  recruitBenefit3: string;
  recruitBenefit4: string;

  // 8. Footer Section
  footerContactBadge: string;
  footerContactTitle: string;
  footerContactSubtitle: string;
  footerCopyright: string;
  facebookUrl: string;

  // 9. Layout JSON (section order/visibility + repeatable items)
  layoutJson?: string;
};

export async function getSiteContent() {
  try {
    let content = await prisma.siteContent.findUnique({
      where: { id: "default" },
    });

    if (!content) {
      content = await prisma.siteContent.create({
        data: { id: "default" },
      });
    }

    return { success: true, data: content };
  } catch (error) {
    console.error("Error fetching site content:", error);
    return { success: false, error: "ไม่สามารถดึงข้อมูลเนื้อหาเว็บไซต์ได้" };
  }
}

export async function updateSiteContent(data: Partial<SiteContentData>) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

  try {
    // Sanitize and trim strings
    const sanitizedData: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        sanitizedData[key] = value.trim();
      }
    }

    if (typeof data.layoutJson === "string") {
      sanitizedData.layoutJson = JSON.stringify(parseLayout(data.layoutJson));
    }

    const updated = await prisma.siteContent.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        ...sanitizedData,
      },
      update: sanitizedData,
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      data: updated,
      message: "บันทึกการตั้งค่าเนื้อหาหน้าแรกเรียบร้อยแล้ว",
    };
  } catch (error) {
    console.error("Error updating site content:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกเนื้อหาเว็บไซต์" };
  }
}

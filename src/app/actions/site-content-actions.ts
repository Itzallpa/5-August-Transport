"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

  // 2. Hero Section
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

  // 3. About Section
  aboutBadge: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutStory1: string;
  aboutStory2: string;
  aboutVision: string;
  aboutMission: string;
  aboutRegisteredCapital: string;

  // 4. Recruitment Section
  recruitBadge: string;
  recruitTitle: string;
  recruitSubtitle: string;
  recruitIncomeHighlight: string;
  recruitBenefit1: string;
  recruitBenefit2: string;
  recruitBenefit3: string;
  recruitBenefit4: string;

  // 5. Quote Section
  quoteTitle: string;
  quoteSubtitle: string;
  quoteNotice: string;
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
  try {
    // Sanitize and trim strings
    const sanitizedData: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        sanitizedData[key] = value.trim();
      }
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

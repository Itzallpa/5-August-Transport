import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { driverApplicationSchema } from "@/lib/validations";
import { checkRateLimit, validateAntiScraping } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // 0. Anti-Scraping / Bot Inspection
    const antiScraping = validateAntiScraping(request);
    if (!antiScraping.allowed) {
      return NextResponse.json(
        { success: false, error: antiScraping.reason },
        { status: 403 }
      );
    }

    // 1. IP-based rate limiting (max 10 requests per 5 minutes)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown-ip";

    const ipLimit = checkRateLimit(`api-apply:ip:${clientIp}`, 10, 5 * 60 * 1000);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "คุณส่งคำขอบ่อยเกินไป กรุณารอ 5 นาทีแล้วลองใหม่อีกครั้ง" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = driverApplicationSchema.parse(body);

    // 2. Phone-based rate limiting (max 4 requests per 10 minutes)
    const phoneLimit = checkRateLimit(`api-apply:phone:${validated.phone}`, 4, 10 * 60 * 1000);
    if (!phoneLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "หมายเลขโทรศัพท์นี้ส่งใบสมัครบ่อยเกินไป กรุณารอ 10 นาทีแล้วลองใหม่อีกครั้ง" },
        { status: 429 }
      );
    }

    // AI Blacklist Screening Engine
    const { runAIScreening } = await import("@/lib/ai-screening");
    const screening = await runAIScreening({
      fullName: validated.fullName,
      phone: validated.phone,
      lineId: validated.lineId,
      province: validated.province,
    });

    if (screening.isBlocked) {
      await prisma.driverApplication.create({
        data: {
          fullName: validated.fullName,
          phone: validated.phone,
          lineId: validated.lineId || null,
          province: validated.province,
          licenseType: validated.licenseType,
          vehicleType: validated.vehicleType,
          experienceYears: validated.experienceYears,
          notes: validated.notes
            ? `${validated.notes} | ${screening.aiExplanation}`
            : screening.aiExplanation,
          documentUrl: validated.documentUrl || null,
          status: "BANNED",
          banReason: `🚫 ตรวจพบบัญชีดำ (Blacklist Intercepted): ${screening.aiExplanation} (${Math.round(screening.confidenceScore * 100)}% Match)`,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: "ขออภัย ระบบไม่สามารถดำเนินการยื่นใบสมัครได้ เนื่องจากข้อมูลตรงกับประวัติบุคคลที่ถูกระงับสิทธิ์ในระบบความปลอดภัย",
          aiBlocked: true,
        },
        { status: 403 }
      );
    }

    const application = await prisma.driverApplication.create({
      data: {
        fullName: validated.fullName,
        phone: validated.phone,
        lineId: validated.lineId || null,
        province: validated.province,
        licenseType: validated.licenseType,
        vehicleType: validated.vehicleType,
        experienceYears: validated.experienceYears,
        notes: validated.notes || null,
        documentUrl: validated.documentUrl || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: application,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API /api/drivers/apply error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

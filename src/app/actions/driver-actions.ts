"use server";

import { prisma } from "@/lib/prisma";
import { driverApplicationSchema, DriverApplicationInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { runAIScreening } from "@/lib/ai-screening";
import { checkRateLimit } from "@/lib/security";

export async function submitDriverApplication(data: DriverApplicationInput) {
  try {
    const validated = driverApplicationSchema.parse(data);

    // Rate limit: max 4 submissions per 10 minutes per phone number
    const rateLimit = checkRateLimit(`apply:${validated.phone}`, 4, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "หมายเลขโทรศัพท์นี้ส่งใบสมัครบ่อยเกินไป กรุณารอ 10 นาทีแล้วลองใหม่อีกครั้ง",
      };
    }

    // AI Blacklist Screening Engine
    const screening = await runAIScreening({
      fullName: validated.fullName,
      phone: validated.phone,
      lineId: validated.lineId,
      province: validated.province,
    });

    if (screening.isBlocked) {
      // Record the blocked attempt as BANNED for admin auditing
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

      revalidatePath("/admin");

      return {
        success: false,
        error: "ขออภัย ระบบไม่สามารถดำเนินการยื่นใบสมัครได้ เนื่องจากข้อมูลตรงกับประวัติบุคคลที่ถูกระงับสิทธิ์ในระบบความปลอดภัย",
        aiBlocked: true,
      };
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

    revalidatePath("/admin");

    return {
      success: true,
      data: application,
      message: "ส่งใบสมัครสำเร็จเรียบร้อย! เจ้าหน้าที่ฝ่ายบุคคลจะติดต่อกลับภายใน 24 ชั่วโมง",
    };
  } catch (error: unknown) {
    console.error("Error submitting application:", error);
    const errorMessage =
      error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งใบสมัคร กรุณาลองใหม่อีกครั้ง";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

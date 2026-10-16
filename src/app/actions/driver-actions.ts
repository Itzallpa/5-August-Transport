"use server";

import { prisma } from "@/lib/prisma";
import { driverApplicationSchema, DriverApplicationInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitDriverApplication(data: DriverApplicationInput) {
  try {
    const validated = driverApplicationSchema.parse(data);

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

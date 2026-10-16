import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { driverApplicationSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = driverApplicationSchema.parse(body);

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

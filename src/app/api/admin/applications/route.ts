import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/security";

export async function GET(request: Request) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Access Denied" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { fullName: { contains: q } },
        { phone: { contains: q } },
        { lineId: { contains: q } },
        { province: { contains: q } },
        { vehicleType: { contains: q } },
      ];
    }

    const applications = await prisma.driverApplication.findMany({
      where,
      include: {
        assignedPartner: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error: unknown) {
    console.error("API /api/admin/applications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

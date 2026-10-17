import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/security";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Access Denied" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { partnerId, notes } = body;

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: "partnerId is required" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      return NextResponse.json(
        { success: false, error: "Partner not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.driverApplication.update({
      where: { id },
      data: {
        assignedPartnerId: partnerId,
        status: "ASSIGNED",
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        assignedPartner: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Assigned successfully to ${partner.name}`,
      data: updated,
    });
  } catch (error: unknown) {
    console.error("API assign error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to assign partner" },
      { status: 500 }
    );
  }
}

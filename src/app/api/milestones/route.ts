import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const milestones = await prisma.milestone.findMany({
      where: { isActive: true },
      orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ success: true, data: milestones });
  } catch (error) {
    console.error("GET /api/milestones error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch milestones" }, { status: 500 });
  }
}

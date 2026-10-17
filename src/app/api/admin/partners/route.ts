import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/security";

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      include: {
        _count: {
          select: { drivers: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, data: partners });
  } catch (error: unknown) {
    console.error("API GET partners error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Access Denied" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, contactPerson, phone, email } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Partner name is required" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name: name.trim(),
        contactPerson: contactPerson?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
      },
    });

    return NextResponse.json(
      { success: true, data: partner, message: "Partner created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API POST partner error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create partner. Name might be duplicate." },
      { status: 400 }
    );
  }
}

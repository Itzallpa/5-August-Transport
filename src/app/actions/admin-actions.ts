"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ApplicationFilter = {
  status?: string;
  search?: string;
  partnerId?: string;
};

export async function getDashboardMetrics() {
  try {
    const total = await prisma.driverApplication.count();
    const pending = await prisma.driverApplication.count({
      where: { status: "PENDING" },
    });
    const approved = await prisma.driverApplication.count({
      where: { status: "APPROVED" },
    });

    // Find KEX partner id
    const kex = await prisma.partner.findFirst({
      where: { name: { contains: "KEX" } },
    });

    const assignedKex = kex
      ? await prisma.driverApplication.count({
          where: {
            assignedPartnerId: kex.id,
          },
        })
      : 0;

    const assignedTotal = await prisma.driverApplication.count({
      where: { status: "ASSIGNED" },
    });

    const rejected = await prisma.driverApplication.count({
      where: { status: "REJECTED" },
    });

    const partnersCount = await prisma.partner.count();

    return {
      success: true,
      data: {
        total,
        pending,
        approved,
        assignedKex,
        assignedTotal,
        rejected,
        partnersCount,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      success: false,
      data: {
        total: 0,
        pending: 0,
        approved: 0,
        assignedKex: 0,
        assignedTotal: 0,
        rejected: 0,
        partnersCount: 0,
      },
    };
  }
}

export async function getDriverApplications(filters?: ApplicationFilter) {
  try {
    const whereClause: Record<string, unknown> = {};

    if (filters?.status && filters.status !== "ALL") {
      whereClause.status = filters.status;
    }

    if (filters?.partnerId && filters.partnerId !== "ALL") {
      whereClause.assignedPartnerId = filters.partnerId;
    }

    if (filters?.search && filters.search.trim() !== "") {
      const q = filters.search.trim();
      whereClause.OR = [
        { fullName: { contains: q } },
        { phone: { contains: q } },
        { lineId: { contains: q } },
        { province: { contains: q } },
        { vehicleType: { contains: q } },
      ];
    }

    const applications = await prisma.driverApplication.findMany({
      where: whereClause,
      include: {
        assignedPartner: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: applications,
    };
  } catch (error) {
    console.error("Error fetching applications:", error);
    return {
      success: false,
      data: [],
      error: "ไม่สามารถดึงข้อมูลใบสมัครได้",
    };
  }
}

export async function assignDriverPartner(
  applicationId: string,
  partnerId: string,
  notes?: string
) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      return { success: false, error: "ไม่พบข้อมูลพันธมิตรที่เลือก" };
    }

    const updated = await prisma.driverApplication.update({
      where: { id: applicationId },
      data: {
        assignedPartnerId: partnerId,
        status: "ASSIGNED",
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        assignedPartner: true,
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: updated,
      message: `มอบหมายคนขับให้ ${partner.name} เรียบร้อยแล้ว`,
    };
  } catch (error) {
    console.error("Error assigning partner:", error);
    return {
      success: false,
      error: "ไม่สามารถมอบหมายพันธมิตรได้ กรุณาลองใหม่อีกครั้ง",
    };
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "ASSIGNED",
  notes?: string
) {
  try {
    const dataToUpdate: Record<string, unknown> = { status };
    if (notes !== undefined) {
      dataToUpdate.notes = notes;
    }
    // If resetting back to PENDING or REJECTED from ASSIGNED, should we clear partner?
    if (status === "REJECTED" || status === "PENDING") {
      dataToUpdate.assignedPartnerId = null;
    }

    const updated = await prisma.driverApplication.update({
      where: { id: applicationId },
      data: dataToUpdate,
      include: {
        assignedPartner: true,
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: updated,
      message: "อัปเดตสถานะสำเร็จ",
    };
  } catch (error) {
    console.error("Error updating status:", error);
    return {
      success: false,
      error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ",
    };
  }
}

export async function deleteApplication(applicationId: string) {
  try {
    await prisma.driverApplication.delete({
      where: { id: applicationId },
    });
    revalidatePath("/admin");
    return { success: true, message: "ลบใบสมัครเรียบร้อยแล้ว" };
  } catch (error) {
    console.error("Error deleting application:", error);
    return { success: false, error: "ไม่สามารถลบใบสมัครได้" };
  }
}

export async function getPartners() {
  try {
    const partners = await prisma.partner.findMany({
      include: {
        _count: {
          select: { drivers: true },
        },
        drivers: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            vehicleType: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { success: true, data: partners };
  } catch (error) {
    console.error("Error getting partners:", error);
    return { success: false, data: [] };
  }
}

export async function createPartner(
  name: string,
  contactPerson?: string,
  phone?: string,
  email?: string
) {
  try {
    const trimmed = name.trim();
    if (!trimmed) {
      return { success: false, error: "กรุณาระบุชื่อพันธมิตร" };
    }

    const partner = await prisma.partner.create({
      data: {
        name: trimmed,
        contactPerson: contactPerson?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: partner,
      message: `เพิ่มพันธมิตร ${partner.name} สำเร็จ`,
    };
  } catch (error: unknown) {
    console.error("Error creating partner:", error);
    return {
      success: false,
      error: "ชื่อพันธมิตรนี้อาจมีอยู่ในระบบแล้ว หรือเกิดข้อผิดพลาด",
    };
  }
}

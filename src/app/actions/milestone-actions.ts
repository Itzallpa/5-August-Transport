"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/security";

export type MilestoneInput = {
  year: string;
  title: string;
  description: string;
  tag?: string;
  orderIndex?: number;
};

export async function getMilestones() {
  try {
    const milestones = await prisma.milestone.findMany({
      orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
    });
    return { success: true, data: milestones };
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return { success: false, data: [] };
  }
}

export async function createMilestone(data: MilestoneInput) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }
  try {
    if (!data.year.trim() || !data.title.trim() || !data.description.trim()) {
      return { success: false, error: "กรุณากรอกปี หัวข้อ และรายละเอียดให้ครบถ้วน" };
    }

    // Determine default orderIndex as max + 1
    const count = await prisma.milestone.count();

    const created = await prisma.milestone.create({
      data: {
        year: data.year.trim(),
        title: data.title.trim(),
        description: data.description.trim(),
        tag: data.tag?.trim() || null,
        orderIndex: data.orderIndex ?? count + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      data: created,
      message: `เพิ่มก้าวสำคัญปี ${created.year} สำเร็จ`,
    };
  } catch (error) {
    console.error("Error creating milestone:", error);
    return { success: false, error: "ไม่สามารถเพิ่มก้าวสำคัญได้" };
  }
}

export async function updateMilestone(
  id: string,
  data: Partial<MilestoneInput> & { isActive?: boolean }
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

  try {
    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        ...(data.year !== undefined ? { year: data.year.trim() } : {}),
        ...(data.title !== undefined ? { title: data.title.trim() } : {}),
        ...(data.description !== undefined ? { description: data.description.trim() } : {}),
        ...(data.tag !== undefined ? { tag: data.tag.trim() || null } : {}),
        ...(data.orderIndex !== undefined ? { orderIndex: data.orderIndex } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      data: updated,
      message: `แก้ไขก้าวสำคัญปี ${updated.year} เรียบร้อยแล้ว`,
    };
  } catch (error) {
    console.error("Error updating milestone:", error);
    return { success: false, error: "ไม่สามารถแก้ไขก้าวสำคัญได้" };
  }
}

export async function deleteMilestone(id: string) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

  try {
    const deleted = await prisma.milestone.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: `ลบก้าวสำคัญปี ${deleted.year} สำเร็จ`,
    };
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return { success: false, error: "ไม่สามารถลบก้าวสำคัญได้" };
  }
}

export async function moveMilestoneOrder(id: string, direction: "up" | "down") {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

  try {
    const current = await prisma.milestone.findUnique({ where: { id } });
    if (!current) return { success: false, error: "ไม่พบข้อมูล" };

    const all = await prisma.milestone.findMany({
      orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
    });

    const currentIndex = all.findIndex((m) => m.id === id);
    if (currentIndex === -1) return { success: false, error: "ไม่พบข้อมูล" };

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= all.length) {
      return { success: true }; // Already at edge
    }

    const target = all[targetIndex];

    // Swap orderIndex values
    await prisma.$transaction([
      prisma.milestone.update({
        where: { id: current.id },
        data: { orderIndex: target.orderIndex },
      }),
      prisma.milestone.update({
        where: { id: target.id },
        data: { orderIndex: current.orderIndex },
      }),
    ]);

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "สลับลำดับก้าวสำคัญเรียบร้อย" };
  } catch (error) {
    console.error("Error moving milestone order:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการสลับลำดับ" };
  }
}

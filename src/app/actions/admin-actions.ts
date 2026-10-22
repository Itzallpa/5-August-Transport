"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  requireAdminAuth,
  checkRateLimit,
} from "@/lib/security";

export type ApplicationFilter = {
  status?: string;
  search?: string;
  partnerId?: string;
};

export async function getDashboardMetrics() {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return {
      success: false,
      error: "Unauthorized",
      data: {
        total: 0,
        pending: 0,
        fleet: 0,
        approved: 0,
        assignedKex: 0,
        assignedTotal: 0,
        rejected: 0,
        banned: 0,
        partnersCount: 0,
      },
    };
  }

  try {
    const total = await prisma.driverApplication.count();
    const pending = await prisma.driverApplication.count({
      where: { status: "PENDING" },
    });
    const fleet = await prisma.driverApplication.count({
      where: { status: { in: ["APPROVED", "ASSIGNED"] } },
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

    const banned = await prisma.driverApplication.count({
      where: { status: "BANNED" },
    });

    const partnersCount = await prisma.partner.count();

    return {
      success: true,
      data: {
        total,
        pending,
        fleet,
        approved,
        assignedKex,
        assignedTotal,
        rejected,
        banned,
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
        fleet: 0,
        approved: 0,
        assignedKex: 0,
        assignedTotal: 0,
        rejected: 0,
        banned: 0,
        partnersCount: 0,
      },
    };
  }
}

export async function getDriverApplications(filters?: ApplicationFilter) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return {
      success: false,
      data: [],
      error: "Unauthorized: กรุณาเข้าสู่ระบบก่อนดูข้อมูลผู้สมัคร",
    };
  }

  try {
    const whereClause: Record<string, unknown> = {};

    if (filters?.status && filters.status !== "ALL") {
      if (filters.status === "FLEET") {
        whereClause.status = { in: ["APPROVED", "ASSIGNED"] };
      } else {
        whereClause.status = filters.status;
      }
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
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

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
  status: "PENDING" | "APPROVED" | "REJECTED" | "ASSIGNED" | "BANNED",
  notes?: string,
  banReason?: string
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

  try {
    const dataToUpdate: Record<string, unknown> = { status };
    if (notes !== undefined) {
      dataToUpdate.notes = notes;
    }
    if (status === "BANNED") {
      dataToUpdate.assignedPartnerId = null;
      if (banReason) {
        dataToUpdate.banReason = banReason;
      }
    } else if (status === "PENDING" || status === "APPROVED") {
      dataToUpdate.banReason = null;
    }

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
      message: status === "BANNED" ? "ระงับสิทธิ์ / แบนคนขับเรียบร้อยแล้ว" : "อัปเดตสถานะสำเร็จ",
    };
  } catch (error) {
    console.error("Error updating status:", error);
    return {
      success: false,
      error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ",
    };
  }
}

export async function banDriverAction(
  applicationId: string,
  banReason: string
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

  try {
    const updated = await prisma.driverApplication.update({
      where: { id: applicationId },
      data: {
        status: "BANNED",
        banReason: banReason || "ถูกระงับสิทธิ์โดยผู้ดูแลระบบ",
        assignedPartnerId: null,
      },
      include: {
        assignedPartner: true,
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: updated,
      message: `แบนคนขับ "${updated.fullName}" สำเร็จ บันทึกเข้าสู่ระบบบัญชีดำเรียบร้อยแล้ว`,
    };
  } catch (error) {
    console.error("Error banning driver:", error);
    return {
      success: false,
      error: "ไม่สามารถระงับสิทธิ์คนขับได้",
    };
  }
}

export async function unbanDriverAction(applicationId: string) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

  try {
    const updated = await prisma.driverApplication.update({
      where: { id: applicationId },
      data: {
        status: "PENDING",
        banReason: null,
      },
      include: {
        assignedPartner: true,
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: updated,
      message: `ปลดแบน "${updated.fullName}" เรียบร้อยแล้ว นำกลับมาเป็นรอตรวจสอบ`,
    };
  } catch (error) {
    console.error("Error unbanning driver:", error);
    return {
      success: false,
      error: "ไม่สามารถปลดแบนได้",
    };
  }
}

export async function deleteApplication(applicationId: string) {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

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
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

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

// ==========================================
// ADMIN AUTHENTICATION & PASSWORD MANAGEMENT
// ==========================================

export async function adminLoginAction(usernameInput: string, passwordInput: string) {
  try {
    const username = usernameInput.trim();
    const password = passwordInput.trim();

    if (!username || !password) {
      return { success: false, error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
    }

    // Rate limiting: max 5 login attempts per 60 seconds per username
    const rateLimit = checkRateLimit(`login:${username}`, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "คุณพยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอ 1 นาทีแล้วลองใหม่อีกครั้ง (Rate Limited)",
      };
    }

    let user = await prisma.adminUser.findUnique({
      where: { username },
    });

    // Auto-seed admin user with hashed password if table is empty
    if (!user && username === "admin" && password === "admin123") {
      const hashedInitial = await hashPassword("admin123");
      user = await prisma.adminUser.create({
        data: {
          username: "admin",
          passwordHash: hashedInitial,
          role: "ADMIN",
        },
      });
    }

    if (!user) {
      return { success: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    // Cryptographic verification (handles both scrypt hash & legacy plain)
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    // Transparently upgrade legacy plaintext password to secure salted scrypt hash
    if (!user.passwordHash.includes(":")) {
      const upgradedHash = await hashPassword(password);
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { passwordHash: upgradedHash },
      });
    }

    // Sign session token with HMAC
    const signedSession = signSessionToken(user.id);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", signedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูลเข้าสู่ระบบ" };
  }
}

export async function adminLogoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}

export async function checkAdminAuthAction() {
  try {
    const auth = await requireAdminAuth();
    if (!auth.authorized || !auth.user) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
      user: auth.user,
    };
  } catch (error) {
    console.error("Auth check error:", error);
    return { isAuthenticated: false };
  }
}

export async function changeAdminPasswordAction(currentPasswordInput: string, newPasswordInput: string) {
  try {
    const currentPassword = currentPasswordInput.trim();
    const newPassword = newPasswordInput.trim();

    if (!currentPassword || !newPassword) {
      return { success: false, error: "กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่" };
    }

    if (newPassword.length < 4) {
      return { success: false, error: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร" };
    }

    const auth = await requireAdminAuth();
    if (!auth.authorized || !auth.user) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนเปลี่ยนรหัสผ่าน" };
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: auth.user.id },
    });

    if (!user) {
      return { success: false, error: "ไม่พบบัญชีผู้ใช้" };
    }

    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return { success: false, error: "รหัสผ่านเดิมไม่ถูกต้อง" };
    }

    // Securely hash the new password
    const hashedNew = await hashPassword(newPassword);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: hashedNew },
    });

    return { success: true, message: `เปลี่ยนรหัสผ่านของบัญชี "${user.username}" สำเร็จเรียบร้อยแล้ว` };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" };
  }
}

// ==========================================
// USER MANAGEMENT ACTIONS (ADMIN ONLY)
// ==========================================

export type AdminUserData = {
  id: string;
  username: string;
  role: string;
  createdAt: Date | string;
};

export async function getAdminUsersAction() {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return { success: false, error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้", data: [] };
  }
}

export async function createAdminUserAction(usernameInput: string, passwordInput: string, roleInput: string = "ADMIN") {
  const auth = await requireAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

  try {
    const username = usernameInput.trim();
    const password = passwordInput.trim();
    const role = roleInput.trim().toUpperCase() || "ADMIN";

    if (!username || username.length < 3) {
      return { success: false, error: "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร" };
    }

    if (!password || password.length < 6) {
      return { success: false, error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" };
    }

    // Check if username already exists
    const existing = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (existing) {
      return { success: false, error: `ชื่อผู้ใช้ "${username}" มีอยู่ในระบบแล้ว` };
    }

    // Hash password with cryptographically secure Scrypt
    const passwordHash = await hashPassword(password);

    const newUser = await prisma.adminUser.create({
      data: {
        username,
        passwordHash,
        role,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: newUser,
      message: `สร้างผู้ใช้งาน "${newUser.username}" สำเร็จเรียบร้อยแล้ว`,
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน" };
  }
}

export async function deleteAdminUserAction(userId: string) {
  const auth = await requireAdminAuth();
  if (!auth.authorized || !auth.user) {
    return { success: false, error: "Unauthorized: ไม่มีสิทธิ์ดำเนินการ" };
  }

  try {
    if (auth.user.id === userId) {
      return { success: false, error: "คุณไม่สามารถลบบัญชีผู้ใช้ของตัวเองที่กำลังล็อกอินอยู่ได้" };
    }

    const totalAdmins = await prisma.adminUser.count();
    if (totalAdmins <= 1) {
      return { success: false, error: "ไม่สามารถลบได้ เนื่องจากต้องมีผู้ดูแลระบบอย่างน้อย 1 บัญชี" };
    }

    await prisma.adminUser.delete({
      where: { id: userId },
    });

    revalidatePath("/admin");
    return { success: true, message: "ลบผู้ใช้งานสำเร็จแล้ว" };
  } catch (error) {
    console.error("Error deleting admin user:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการลบผู้ใช้งาน" };
  }
}

export async function resetUserPasswordByAdminAction(
  targetUserId: string,
  newPasswordInput: string
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized || !auth.user) {
    return { success: false, error: "Unauthorized: กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  const requesterRole = (auth.user.role || "ADMIN").toUpperCase();
  if (requesterRole !== "SUPERADMIN" && requesterRole !== "ADMIN") {
    return {
      success: false,
      error: "สิทธิ์ไม่เพียงพอ: เฉพาะผู้ดูแลระบบ (Admin หรือ Super Admin) เท่านั้นที่สามารถเปลี่ยนรหัสผ่านของผู้ใช้อื่นได้",
    };
  }

  try {
    const newPassword = newPasswordInput.trim();
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร" };
    }

    const targetUser = await prisma.adminUser.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return { success: false, error: "ไม่พบบัญชีผู้ใช้งานที่ต้องการเปลี่ยนรหัสผ่าน" };
    }

    // Role hierarchy check: only SUPERADMIN can change another SUPERADMIN
    const targetRole = (targetUser.role || "ADMIN").toUpperCase();
    if (targetRole === "SUPERADMIN" && requesterRole !== "SUPERADMIN") {
      return {
        success: false,
        error: "สิทธิ์ไม่เพียงพอ: บัญชี Super Admin สามารถถูกแก้ไขได้โดยผู้มียศ Super Admin ด้วยกันเท่านั้น",
      };
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.adminUser.update({
      where: { id: targetUserId },
      data: { passwordHash },
    });

    revalidatePath("/admin");
    return {
      success: true,
      message: `เปลี่ยนรหัสผ่านให้ผู้ใช้ "${targetUser.username}" สำเร็จเรียบร้อยแล้ว`,
    };
  } catch (error) {
    console.error("Error resetting user password by admin:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่านผู้ใช้งาน" };
  }
}

export async function updateAdminUserRoleAction(
  targetUserId: string,
  newRoleInput: string
) {
  const auth = await requireAdminAuth();
  if (!auth.authorized || !auth.user) {
    return { success: false, error: "Unauthorized: กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  const requesterRole = (auth.user.role || "ADMIN").toUpperCase();
  if (requesterRole !== "SUPERADMIN" && requesterRole !== "ADMIN") {
    return {
      success: false,
      error: "สิทธิ์ไม่เพียงพอ: เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเปลี่ยนระดับสิทธิ์ได้",
    };
  }

  try {
    const role = newRoleInput.trim().toUpperCase();
    if (!["SUPERADMIN", "ADMIN", "STAFF"].includes(role)) {
      return { success: false, error: "ระดับสิทธิ์ไม่ถูกต้อง" };
    }

    const targetUser = await prisma.adminUser.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return { success: false, error: "ไม่พบบัญชีผู้ใช้" };
    }

    if (targetUser.role === "SUPERADMIN" && requesterRole !== "SUPERADMIN") {
      return {
        success: false,
        error: "สิทธิ์ไม่เพียงพอ: ไม่สามารถเปลี่ยนสิทธิ์ของ Super Admin ได้",
      };
    }

    if (role === "SUPERADMIN" && requesterRole !== "SUPERADMIN") {
      return {
        success: false,
        error: "สิทธิ์ไม่เพียงพอ: เฉพาะ Super Admin เท่านั้นที่สามารถแต่งตั้งสิทธิ์ Super Admin ได้",
      };
    }

    await prisma.adminUser.update({
      where: { id: targetUserId },
      data: { role },
    });

    revalidatePath("/admin");
    return {
      success: true,
      message: `เปลี่ยนระดับสิทธิ์ของ "${targetUser.username}" เป็น ${role} สำเร็จแล้ว`,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการเปลี่ยนระดับสิทธิ์" };
  }
}


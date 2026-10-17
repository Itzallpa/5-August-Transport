import { prisma } from "@/lib/prisma";

export interface AIScreeningResult {
  isBlocked: boolean;
  matchType?: "PHONE" | "LINE" | "NAME" | "COMBINED";
  matchedDriverId?: string;
  matchedDriverName?: string;
  matchedReason?: string;
  confidenceScore: number;
  aiExplanation: string;
}

/**
 * Clean & normalize phone numbers for accurate matching.
 * e.g., "+66 84-511-5444" -> "0845115444"
 */
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("66")) {
    cleaned = "0" + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Clean & normalize LINE IDs for accurate matching.
 */
export function normalizeLine(lineId?: string | null): string {
  if (!lineId) return "";
  return lineId.toLowerCase().replace(/[@\s]/g, "").trim();
}

/**
 * Clean & normalize Thai/English full names for comparison.
 */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(นาย|นางสาว|นาง|น\.ส\.|mr\.|mrs\.|ms\.)\s*/i, "")
    .replace(/\s+/g, "")
    .trim();
}

/**
 * Calculate simple Levenshtein distance for fuzzy name matching.
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Check application data against all BANNED records in database.
 * Uses exact match & heuristic AI similarity screening.
 */
export async function runAIScreening(applicant: {
  fullName: string;
  phone: string;
  lineId?: string | null;
  province?: string | null;
}): Promise<AIScreeningResult> {
  const normPhone = normalizePhone(applicant.phone);
  const normLine = normalizeLine(applicant.lineId);
  const normName = normalizeName(applicant.fullName);

  // Retrieve all banned drivers from database
  const bannedList = await prisma.driverApplication.findMany({
    where: {
      status: "BANNED",
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      lineId: true,
      banReason: true,
      notes: true,
    },
  });

  if (bannedList.length === 0) {
    return {
      isBlocked: false,
      confidenceScore: 0,
      aiExplanation: "ผ่านการตรวจสอบ: ไม่พบประวัติบัญชีดำในระบบ",
    };
  }

  for (const banned of bannedList) {
    const bannedPhone = normalizePhone(banned.phone);
    const bannedLine = normalizeLine(banned.lineId);
    const bannedName = normalizeName(banned.fullName);

    // 1. Exact Phone Match
    if (normPhone && bannedPhone && normPhone === bannedPhone) {
      return {
        isBlocked: true,
        matchType: "PHONE",
        matchedDriverId: banned.id,
        matchedDriverName: banned.fullName,
        matchedReason: banned.banReason || "เคยถูกระงับสิทธิ์ในระบบ",
        confidenceScore: 0.99,
        aiExplanation: `ระบบตรวจพบเบอร์โทรศัพท์ (${applicant.phone}) ตรงกับบัญชีดำของ "${banned.fullName}" ที่เคยถูกแบน (สาเหตุ: ${banned.banReason || "ถูกระงับสิทธิ์"})`,
      };
    }

    // 2. Exact LINE ID Match
    if (normLine && bannedLine && normLine === bannedLine) {
      return {
        isBlocked: true,
        matchType: "LINE",
        matchedDriverId: banned.id,
        matchedDriverName: banned.fullName,
        matchedReason: banned.banReason || "เคยถูกระงับสิทธิ์ในระบบ",
        confidenceScore: 0.95,
        aiExplanation: `ระบบตรวจพบ LINE ID (${applicant.lineId}) ตรงกับบัญชีดำของ "${banned.fullName}" ที่เคยถูกแบน`,
      };
    }

    // 3. Exact or Fuzzy Name Match
    if (normName && bannedName) {
      if (normName === bannedName) {
        return {
          isBlocked: true,
          matchType: "NAME",
          matchedDriverId: banned.id,
          matchedDriverName: banned.fullName,
          matchedReason: banned.banReason || "เคยถูกระงับสิทธิ์ในระบบ",
          confidenceScore: 0.92,
          aiExplanation: `ระบบตรวจพบชื่อผู้สมัคร "${applicant.fullName}" ตรงกับประวัติบุคคลที่ถูกระงับสิทธิ์`,
        };
      }

      // Fuzzy match for minor typos or formatting differences
      const maxLen = Math.max(normName.length, bannedName.length);
      if (maxLen > 5) {
        const dist = levenshteinDistance(normName, bannedName);
        const similarity = 1 - dist / maxLen;
        if (similarity >= 0.85) {
          return {
            isBlocked: true,
            matchType: "NAME",
            matchedDriverId: banned.id,
            matchedDriverName: banned.fullName,
            matchedReason: banned.banReason || "เคยถูกระงับสิทธิ์ในระบบ",
            confidenceScore: Number(similarity.toFixed(2)),
            aiExplanation: `ระบบวิเคราะห์ความคล้ายคลึงของชื่อ (${Math.round(similarity * 100)}%) ตรงกับบุคคลที่ถูกระงับสิทธิ์ "${banned.fullName}"`,
          };
        }
      }
    }
  }

  return {
    isBlocked: false,
    confidenceScore: 0,
    aiExplanation: "ผ่านการตรวจสอบความปลอดภัย: ประวัติปกติ ไม่พบการเชื่อมโยงกับบัญชีดำ",
  };
}

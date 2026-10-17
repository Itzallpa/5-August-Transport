import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { checkRateLimit, validateAntiScraping } from "@/lib/security";

/**
 * Validate binary file signatures (Magic Bytes) to prevent extension spoofing & malware uploads.
 */
function detectImageType(buffer: Buffer): { ext: string; mime: string } | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: ".jpg", mime: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { ext: ".png", mime: "image/png" };
  }

  // GIF: GIF87a or GIF89a (47 49 46 38)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { ext: ".gif", mime: "image/gif" };
  }

  // WebP: RIFF .... WEBP
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { ext: ".webp", mime: "image/webp" };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // 0. Anti-Scraping / Bot Inspection
    const antiScraping = validateAntiScraping(request);
    if (!antiScraping.allowed) {
      return NextResponse.json(
        { success: false, error: antiScraping.reason },
        { status: 403 }
      );
    }

    // 1. IP Rate Limiting (max 12 uploads per 60 seconds per IP to stop disk spam)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown-ip";

    const rateLimit = checkRateLimit(`upload:${clientIp}`, 12, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "คุณอัปโหลดไฟล์บ่อยเกินไป กรุณารอสักครู่ (Rate Limit Exceeded)" },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "กรุณาเลือกไฟล์รูปภาพที่ต้องการอัปโหลด" },
        { status: 400 }
      );
    }

    // 2. Strict file size cap (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "ขนาดไฟล์ต้องไม่เกิน 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Binary Magic Byte Verification (Reject SVG / HTML / scripts / spoofed executables)
    const detected = detectImageType(buffer);
    if (!detected) {
      return NextResponse.json(
        {
          success: false,
          error: "ไฟล์รูปภาพไม่ถูกต้องหรือรูปแบบไม่ปลอดภัย (รองรับเฉพาะ JPG, PNG, WEBP, GIF เท่านั้น)",
        },
        { status: 400 }
      );
    }

    // 4. Secure Random File Naming (Prevents directory traversal & filename spoofing)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeToken = crypto.randomBytes(16).toString("hex");
    const uniqueFileName = `${Date.now()}_${safeToken}${detected.ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "อัปโหลดรูปภาพสำเร็จ",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการบันทึกรูปภาพ" },
      { status: 500 }
    );
  }
}

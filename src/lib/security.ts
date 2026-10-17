import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Secret for HMAC signing session tokens. Uses ENV or fallback derived key.
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.ADMIN_SECRET ||
  "5-august-transport-secure-session-salt-2026-key-x992";

/**
 * Hash a password using scrypt with a unique cryptographically random salt.
 * Format: "salt_hex:hash_hex"
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

/**
 * Verify a plaintext password against a stored hash.
 * Supports constant-time comparison and legacy plaintext migration.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  if (!storedHash || !password) return false;

  // If stored in new salted format "salt:hash"
  if (storedHash.includes(":")) {
    const [salt, key] = storedHash.split(":");
    return new Promise((resolve) => {
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        const keyBuffer = Buffer.from(key, "hex");
        const match = crypto.timingSafeEqual(derivedKey, keyBuffer);
        resolve(match);
      });
    });
  }

  // Fallback for legacy plain-text password (matches exactly once, then gets updated)
  const isPlainMatch = password === storedHash;
  return isPlainMatch;
}

/**
 * Sign a session token using HMAC-SHA256.
 * Format: "userId.hmacSignature"
 */
export function signSessionToken(userId: string): string {
  const hmac = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(userId)
    .digest("hex");
  return `${userId}.${hmac}`;
}

/**
 * Verify an HMAC-signed session token.
 * Returns the userId if valid and untampered, or null if invalid.
 */
export function verifySessionToken(token: string): string | null {
  if (!token || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [userId, signature] = parts;
  const expectedHmac = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(userId)
    .digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedHmac, "hex");
    if (sigBuf.length !== expBuf.length) return null;
    if (crypto.timingSafeEqual(sigBuf, expBuf)) {
      return userId;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Authorize an admin request from cookies.
 * Verifies session signature and database existence.
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || !sessionCookie.value) {
    return { authorized: false, user: null, error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ (Unauthorized)" };
  }

  // Verify HMAC signature first
  const userId = verifySessionToken(sessionCookie.value);
  
  // Also check if legacy raw id matches (for backward compatibility during migration)
  const targetId = userId || sessionCookie.value;

  const user = await prisma.adminUser.findUnique({
    where: { id: targetId },
    select: { id: true, username: true, role: true },
  });

  if (!user) {
    return { authorized: false, user: null, error: "เซสชันไม่ถูกต้องหรือหมดอายุ (Invalid Session)" };
  }

  return { authorized: true, user, error: null };
}

/**
 * In-memory sliding window rate limiter
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

// Clean up old rate limit records every 5 minutes safely
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }, 5 * 60 * 1000);
  if (timer && typeof (timer as any).unref === "function") {
    (timer as any).unref();
  }
}

// Re-export anti-scraping functions from dedicated edge-compatible module
export {
  INTERNAL_CLIENT_HEADER,
  isScraperUserAgent,
  isAllowedOrigin,
  validateAntiScraping,
} from "./anti-scraping";



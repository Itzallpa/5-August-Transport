/**
 * Lightweight Anti-Scraping & Request Verification
 * Runs seamlessly in both Edge runtime (middleware) and Node.js runtime.
 */

export const INTERNAL_CLIENT_HEADER = "5-August-Transport-App";

/**
 * Common automated scraper, crawler, and bot signatures.
 */
const KNOWN_SCRAPER_PATTERNS = [
  /python/i,
  /requests/i,
  /scrapy/i,
  /urllib/i,
  /wget/i,
  /httpclient/i,
  /postman/i,
  /insomnia/i,
  /aiohttp/i,
  /go-http-client/i,
  /java\//i,
  /apache-httpclient/i,
  /headless/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /beautifulsoup/i,
  /mechanize/i,
  /libwww/i,
  /node-fetch/i,
  /curl/i,
];

/**
 * Detect automated scrapers and bots by inspecting User-Agent.
 */
export function isScraperUserAgent(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim().length === 0) return true; // Scrapers often omit UA
  return KNOWN_SCRAPER_PATTERNS.some((pattern) => pattern.test(userAgent));
}

/**
 * Check whether origin or referer is from our trusted domain or tunnel.
 */
export function isAllowedOrigin(originOrReferer: string | null, host: string | null, forwardedHost?: string | null): boolean {
  if (!originOrReferer) return true; // Standard browser same-origin if header omitted
  try {
    const url = new URL(originOrReferer);
    if (host && (url.host === host || url.hostname === host || url.origin === host)) return true;
    if (forwardedHost && (url.host === forwardedHost || url.hostname === forwardedHost)) return true;

    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "14.207.143.114" || // Hostatom VPS IP
      hostname === "192.168.227.201" ||
      hostname.includes("5august") ||
      hostname.includes("5-august") ||
      hostname.endsWith(".ngrok-free.dev") ||
      hostname.endsWith(".ngrok.app") ||
      hostname.endsWith(".ngrok.io") ||
      hostname.endsWith(".trycloudflare.com") ||
      hostname.endsWith(".loca.lt")
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return true;
}

/**
 * Anti-scraping validation logic for Edge & Node.
 */
export function validateAntiScraping(request: Request): {
  allowed: boolean;
  reason?: string;
} {
  const ua = request.headers.get("user-agent");
  const host = request.headers.get("host");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const secFetchSite = request.headers.get("sec-fetch-site");
  const secFetchDest = request.headers.get("sec-fetch-dest");
  const customHeader = request.headers.get("x-requested-with");

  // 0. Whitelist verified internal app requests
  if (customHeader === INTERNAL_CLIENT_HEADER || secFetchSite === "same-origin") {
    return { allowed: true };
  }

  // 1. Block automated scrapers (Python, curl, Scrapy, Puppeteer, etc.)
  if (isScraperUserAgent(ua)) {
    return {
      allowed: false,
      reason: "ไม่อนุญาตให้ใช้โปรแกรมอัตโนมัติ (Automated Scraping Bot) ดึงข้อมูล API",
    };
  }

  // 2. Block cross-origin scraping (Sec-Fetch-Site: cross-site)
  if (secFetchSite === "cross-site") {
    return {
      allowed: false,
      reason: "ไม่อนุญาตให้ดึงข้อมูลข้ามโดเมน (Cross-Origin Scraping Forbidden)",
    };
  }

  // 3. Block direct browser navigation to API endpoints as documents
  if (secFetchDest === "document") {
    return {
      allowed: false,
      reason: "ไม่อนุญาตให้เข้าถึง API โดยตรงจากเบราว์เซอร์ (Direct Navigation Forbidden)",
    };
  }

  // 4. Verify origin / referer if provided
  if (origin && !isAllowedOrigin(origin, host, forwardedHost)) {
    return {
      allowed: false,
      reason: "ที่มาของคำขอไม่ได้รับอนุญาต (Origin Forbidden)",
    };
  }
  if (referer && !isAllowedOrigin(referer, host, forwardedHost)) {
    return {
      allowed: false,
      reason: "ที่มาของคำขอไม่ได้รับอนุญาต (Referer Forbidden)",
    };
  }

  return { allowed: true };
}

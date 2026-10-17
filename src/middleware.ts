import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateAntiScraping } from "@/lib/anti-scraping";

/**
 * Next.js Global Anti-Scraping & API Defense Middleware
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all /api/* routes
  if (pathname.startsWith("/api")) {
    const check = validateAntiScraping(request);

    if (!check.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: check.reason || "Access Denied: Automated API scraping is forbidden.",
        },
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }
  }

  const response = NextResponse.next();

  // Attach anti-scraping and privacy headers to all API responses
  if (pathname.startsWith("/api")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};

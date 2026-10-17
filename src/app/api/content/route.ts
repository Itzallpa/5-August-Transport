import { NextRequest, NextResponse } from "next/server";
import { validateAntiScraping } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const check = validateAntiScraping(request);
  if (!check.allowed) {
    return NextResponse.json(
      { success: false, error: check.reason || "Access Denied: Scraping is forbidden." },
      { status: 403 }
    );
  }

  // Disable direct public JSON dumps to prevent competitors/scrapers from pulling data
  return NextResponse.json(
    {
      success: false,
      error: "Access Denied: Public scraping of this endpoint is disabled for security reasons.",
    },
    { status: 403 }
  );
}

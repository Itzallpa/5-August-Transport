import { NextResponse } from "next/server";
import { getSiteContent } from "@/app/actions/site-content-actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getSiteContent();
  return NextResponse.json(result);
}

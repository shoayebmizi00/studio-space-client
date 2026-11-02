import { NextResponse } from "next/server";
import { getStudios } from "@/lib/api";
import { fetchPublishedStudios } from "@/lib/studios-db";

export async function GET() {
  try {
    const studios = await getStudios();
    return NextResponse.json(studios);
  } catch {
    // If standalone Express server is offline, query MongoDB directly
    try {
      const studios = await fetchPublishedStudios();
      return NextResponse.json(studios);
    } catch (dbErr) {
      console.error("Failed to fetch studios from DB fallback:", dbErr);
      return NextResponse.json(
        { error: "Failed to fetch studios." },
        { status: 500 }
      );
    }
  }
}

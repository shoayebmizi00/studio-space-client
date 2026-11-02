import { NextResponse } from "next/server";
import { getStudio } from "@/lib/api";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const studio = await getStudio(id);
    if (!studio) {
      return NextResponse.json({ error: "Studio not found" }, { status: 404 });
    }
    return NextResponse.json(studio);
  } catch (err) {
    console.error("Failed to fetch studio from backend:", err);
    return NextResponse.json(
      { error: "Failed to fetch studio from the backend server." },
      { status: 502 }
    );
  }
}


import { NextResponse } from "next/server";
import { getStudios } from "@/lib/api";

export async function GET() {
  try {
    const studios = await getStudios();
    return NextResponse.json(studios);
  } catch (err) {
    console.error("Failed to fetch studios from backend:", err);
    return NextResponse.json(
      { error: "Failed to fetch studios from the backend server." },
      { status: 502 }
    );
  }
}


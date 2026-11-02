import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";

const studiosCollection = db.collection("studios");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeStudio(body: Record<string, any>) {
  const { latitude, longitude, ...rest } = body;
  const latNum =
    typeof latitude === "string" && latitude.trim() !== ""
      ? Number(latitude.trim())
      : typeof latitude === "number"
        ? latitude
        : undefined;

  const lngNum =
    typeof longitude === "string" && longitude.trim() !== ""
      ? Number(longitude.trim())
      : typeof longitude === "number"
        ? longitude
        : undefined;

  return {
    ...rest,
    hourlyRate: Number(rest.hourlyRate) || 0,
    price: Number(rest.hourlyRate) || 0,
    securityDeposit: Number(rest.securityDeposit) || 0,
    maxCapacity: Number(rest.maxCapacity) || 0,
    capacity: Number(rest.maxCapacity) || 0,
    amenities: Array.isArray(rest.amenities) ? rest.amenities : [],
    equipment: Array.isArray(rest.equipment) ? rest.equipment : [],
    gallery: Array.isArray(rest.gallery) ? rest.gallery : [],
    coverImage: rest.coverImage || null,
    rules: rest.rules || "",
    cancellationPolicy: rest.cancellationPolicy || "",
    rating: 0,
    reviews: 0,
    ...(latNum !== undefined && Number.isFinite(latNum) ? { latitude: latNum } : {}),
    ...(lngNum !== undefined && Number.isFinite(lngNum) ? { longitude: lngNum } : {}),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Studio name is required" }, { status: 400 });
    }

    // Capture logged in host session if available
    const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);

    const now = new Date();
    const studio = {
      ...serializeStudio(body),
      hostId: session?.user?.id || null,
      hostName: session?.user?.name || body.hostName || "Studio host",
      hostEmail: session?.user?.email || body.hostEmail || null,
      status: "published",
      createdAt: now,
      updatedAt: now,
    };

    // Try sending to Express server if running
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const serverRes = await fetch(`${API_URL}/add-studio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        return NextResponse.json(serverData, { status: 201 });
      }
    } catch {
      // Standalone express server is offline; fall back to direct DB insert
    }

    // Direct MongoDB insert
    const result = await studiosCollection.insertOne(studio);

    return NextResponse.json(
      {
        message: "Studio added successfully",
        insertedId: result.insertedId,
        studio: {
          ...studio,
          _id: result.insertedId,
          id: String(result.insertedId),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding studio:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while adding the studio",
      },
      { status: 500 }
    );
  }
}


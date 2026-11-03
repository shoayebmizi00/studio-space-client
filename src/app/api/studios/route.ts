import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";

const studios = db.collection("studios");

// Return the studio in the flat shape every page expects.
function publicStudio(studio: Record<string, unknown>) {
  const id = String(studio._id);
  return { ...studio, _id: id, id };
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

/* ------------------------------------------------------------------ */
/* GET /api/studios?ownerEmail=you@example.com                         */
/* Without the query it returns the public catalog (published only).   */
/* With it, the signed-in user can load their own listings.            */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ownerEmail = url.searchParams.get("ownerEmail");

  // No query → public catalog, same as the Express server.
  if (!ownerEmail) {
    const results = await studios
      .find({ status: { $in: ["published", "Published", "Verified", "verified"] } })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(results.map(publicStudio));
  }

  // ownerEmail → only the signed-in owner may ask for their listings.
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to view your listings" }, { status: 401 });
  }
  if (ownerEmail !== session.user.email) {
    return NextResponse.json({ error: "You can only view your own listings" }, { status: 403 });
  }

  const results = await studios
    .find({ ownerEmail: session.user.email })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(results.map(publicStudio));
}

/* ------------------------------------------------------------------ */
/* POST /api/studios — protected by the JWT session cookie (401)       */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to add a studio" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Studio data is required" }, { status: 400 });
  }

  const name = readString(body.name);
  const coverImage = readString(body.coverImage);
  if (!name) {
    return NextResponse.json({ error: "Studio name is required" }, { status: 400 });
  }
  if (!coverImage) {
    return NextResponse.json({ error: "A cover image is required" }, { status: 400 });
  }

  const now = new Date();
  const studio = {
    name,
    category: readString(body.category),
    shortDescription: readString(body.shortDescription),
    fullDescription: readString(body.fullDescription),
    country: readString(body.country),
    city: readString(body.city),
    streetAddress: readString(body.streetAddress),
    latitude: readString(body.latitude),
    longitude: readString(body.longitude),
    hourlyRate: Number(body.hourlyRate) || 0,
    securityDeposit: Number(body.securityDeposit) || 0,
    maxCapacity: Number(body.maxCapacity) || 0,
    rules: readString(body.rules),
    cancellationPolicy: readString(body.cancellationPolicy),
    amenities: readList(body.amenities),
    equipment: readList(body.equipment),
    coverImage,
    gallery: readList(body.gallery),
    rating: 0,
    reviews: 0,
    status: "published",
    hostName: session.user.name,
    hostEmail: session.user.email,
    ownerName: session.user.name,
    ownerEmail: session.user.email,
    userId: session.user.id,
    createdAt: now,
    updatedAt: now,
  };

  const result = await studios.insertOne(studio);
  return NextResponse.json(publicStudio({ ...studio, _id: result.insertedId }), {
    status: 201,
  });
}

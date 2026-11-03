import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";

const studios = db.collection("studios");

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
/* GET /api/studios/[id] — one studio                                  */
/* ------------------------------------------------------------------ */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid studio id" }, { status: 400 });
  }

  const studio = await studios.findOne({ _id: new ObjectId(id) });
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 });
  }

  return NextResponse.json(publicStudio(studio));
}

/* ------------------------------------------------------------------ */
/* PUT /api/studios/[id] — update my listing (401 / 403)               */
/* ------------------------------------------------------------------ */

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to update a studio" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid studio id" }, { status: 400 });
  }

  const studio = await studios.findOne({ _id: new ObjectId(id) });
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 });
  }

  // Only the owner may edit the listing.
  if (studio.ownerEmail !== session.user.email) {
    return NextResponse.json({ error: "You can only edit your own listings" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Studio data is required" }, { status: 400 });
  }

  const name = readString(body.name);
  if (!name) {
    return NextResponse.json({ error: "Studio name is required" }, { status: 400 });
  }

  const updates = {
    name,
    category: readString(body.category),
    shortDescription: readString(body.shortDescription),
    fullDescription: readString(body.fullDescription),
    country: readString(body.country),
    city: readString(body.city),
    streetAddress: readString(body.streetAddress),
    hourlyRate: Number(body.hourlyRate) || 0,
    securityDeposit: Number(body.securityDeposit) || 0,
    maxCapacity: Number(body.maxCapacity) || 0,
    rules: readString(body.rules),
    cancellationPolicy: readString(body.cancellationPolicy),
    amenities: readList(body.amenities),
    equipment: readList(body.equipment),
    coverImage: readString(body.coverImage),
    gallery: readList(body.gallery),
    updatedAt: new Date(),
  };

  await studios.updateOne({ _id: new ObjectId(id) }, { $set: updates });

  const updated = await studios.findOne({ _id: new ObjectId(id) });
  return NextResponse.json(publicStudio(updated!));
}

/* ------------------------------------------------------------------ */
/* DELETE /api/studios/[id] — remove my listing (401 / 403)            */
/* ------------------------------------------------------------------ */

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: _request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to delete a studio" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid studio id" }, { status: 400 });
  }

  const studio = await studios.findOne({ _id: new ObjectId(id) });
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 });
  }

  if (studio.ownerEmail !== session.user.email) {
    return NextResponse.json({ error: "You can only delete your own listings" }, { status: 403 });
  }

  await studios.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ message: "Studio deleted" });
}

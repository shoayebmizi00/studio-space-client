import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";

const bookings = db.collection("bookings");
const studios = db.collection("studios");

function publicBooking(booking: Record<string, unknown> & { _id: ObjectId }) {
  const id = String(booking._id);
  return { ...booking, _id: id, id };
}

function timeInMinutes(value: unknown): number | null {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return null;
  }
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const results = await bookings
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(results.map(publicBooking));
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to request a booking" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A booking request is required" }, { status: 400 });
  }

  const studioId = typeof body.studioId === "string" ? body.studioId : "";
  const date = typeof body.date === "string" ? body.date : "";
  const startTime = typeof body.startTime === "string" ? body.startTime : "";
  const endTime = typeof body.endTime === "string" ? body.endTime : "";
  const projectDetails = typeof body.projectDetails === "string" ? body.projectDetails.trim() : "";
  const startMinutes = timeInMinutes(startTime);
  const endMinutes = timeInMinutes(endTime);

  if (!ObjectId.isValid(studioId)) {
    return NextResponse.json({ error: "Choose a valid studio" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00`))) {
    return NextResponse.json({ error: "Choose a valid booking date" }, { status: 400 });
  }
  if (date < new Date().toISOString().slice(0, 10)) {
    return NextResponse.json({ error: "Booking date cannot be in the past" }, { status: 400 });
  }
  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return NextResponse.json({ error: "Choose a valid start and end time" }, { status: 400 });
  }
  if (projectDetails.length > 1000) {
    return NextResponse.json({ error: "Project details must be 1000 characters or fewer" }, { status: 400 });
  }

  const studio = await studios.findOne({
    _id: new ObjectId(studioId),
    status: { $in: ["published", "Published", "Verified", "verified"] },
  });
  if (!studio) {
    return NextResponse.json({ error: "Studio is not available" }, { status: 404 });
  }

  const durationHours = (endMinutes - startMinutes) / 60;
  const hourlyRate = Number(studio.hourlyRate ?? studio.pricing?.hourly_rate ?? studio.price ?? 0);
  const securityDeposit = Number(studio.securityDeposit ?? studio.pricing?.security_deposit ?? 0);
  const subtotal = Math.round(hourlyRate * durationHours * 100) / 100;
  const now = new Date();
  const booking = {
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
    studioId,
    studioName: studio.name ?? studio.title ?? "Studio",
    category: studio.category ?? "",
    studioImage: studio.coverImage ?? studio.media?.cover_image ?? null,
    city: studio.city ?? studio.location?.city ?? "",
    country: studio.country ?? studio.location?.country ?? "",
    hostName: studio.hostName ?? studio.owner?.name ?? "Studio host",
    date,
    startTime,
    endTime,
    durationHours,
    hourlyRate,
    subtotal,
    securityDeposit,
    total: subtotal + securityDeposit,
    projectDetails,
    status: "Pending",
    createdAt: now,
    updatedAt: now,
  };

  const result = await bookings.insertOne(booking);
  return NextResponse.json(publicBooking({ ...booking, _id: result.insertedId }), { status: 201 });
}
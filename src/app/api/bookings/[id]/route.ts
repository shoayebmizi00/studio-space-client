import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";

const bookings = db.collection("bookings");

type RouteContext = { params: Promise<{ id: string }> };

function timeInMinutes(value: unknown): number | null {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return null;
  }
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

async function getOwnedBooking(request: Request, id: string) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return { response: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  }
  if (!ObjectId.isValid(id)) {
    return { response: NextResponse.json({ error: "Invalid booking id" }, { status: 400 }) };
  }

  const booking = await bookings.findOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });
  if (!booking) {
    return { response: NextResponse.json({ error: "Booking not found" }, { status: 404 }) };
  }

  return { booking, userId: session.user.id };
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const result = await getOwnedBooking(request, id);
  if ("response" in result) return result.response;
  return NextResponse.json({ ...result.booking, id: String(result.booking._id), _id: String(result.booking._id) });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const result = await getOwnedBooking(request, id);
  if ("response" in result) return result.response;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A booking update is required" }, { status: 400 });
  }

  const booking = result.booking;
  if (body.status === "Cancelled") {
    if (!["Pending", "Confirmed"].includes(String(booking.status))) {
      return NextResponse.json({ error: "This booking cannot be cancelled" }, { status: 409 });
    }
    await bookings.updateOne(
      { _id: booking._id, userId: result.userId },
      { $set: { status: "Cancelled", updatedAt: new Date() } }
    );
  } else {
    if (booking.status !== "Pending") {
      return NextResponse.json({ error: "Only pending bookings can be edited" }, { status: 409 });
    }

    const date = typeof body.date === "string" ? body.date : booking.date;
    const startTime = typeof body.startTime === "string" ? body.startTime : booking.startTime;
    const endTime = typeof body.endTime === "string" ? body.endTime : booking.endTime;
    const projectDetails = typeof body.projectDetails === "string"
      ? body.projectDetails.trim()
      : booking.projectDetails;
    const startMinutes = timeInMinutes(startTime);
    const endMinutes = timeInMinutes(endTime);

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

    const durationHours = (endMinutes - startMinutes) / 60;
    const subtotal = Math.round(Number(booking.hourlyRate) * durationHours * 100) / 100;
    await bookings.updateOne(
      { _id: booking._id, userId: result.userId },
      {
        $set: {
          date,
          startTime,
          endTime,
          durationHours,
          projectDetails,
          subtotal,
          total: subtotal + Number(booking.securityDeposit || 0),
          updatedAt: new Date(),
        },
      }
    );
  }

  const updated = await bookings.findOne({ _id: booking._id, userId: result.userId });
  return NextResponse.json({ ...updated, id: String(updated?._id), _id: String(updated?._id) });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const result = await getOwnedBooking(request, id);
  if ("response" in result) return result.response;
  if (!["Pending", "Cancelled"].includes(String(result.booking.status))) {
    return NextResponse.json({ error: "Only pending or cancelled bookings can be deleted" }, { status: 409 });
  }

  await bookings.deleteOne({ _id: result.booking._id, userId: result.userId });
  return new Response(null, { status: 204 });
}
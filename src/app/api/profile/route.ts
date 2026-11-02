import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";

const profiles = db.collection("profiles");

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const profile = await profiles.findOne({ userId: session.user.id });
  return NextResponse.json({
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
    },
    profile: {
      phone: profile?.phone ?? "",
      city: profile?.city ?? "",
      about: profile?.about ?? "",
      avatarUrl: profile?.avatarUrl ?? null,
    },
  });
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A profile payload is required" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const about = typeof body.about === "string" ? body.about.trim() : "";
  const avatarUrl = typeof body.avatarUrl === "string" ? body.avatarUrl : null;

  if (name !== undefined && (!name || name.length > 120)) {
    return NextResponse.json({ error: "Name must be between 1 and 120 characters" }, { status: 400 });
  }
  if (phone.length > 40 || city.length > 100 || about.length > 1200) {
    return NextResponse.json({ error: "One or more profile fields are too long" }, { status: 400 });
  }
  if (avatarUrl && avatarUrl.length > 3_000_000) {
    return NextResponse.json({ error: "Profile image is too large" }, { status: 413 });
  }

  if (name !== undefined) {
    await auth.api.updateUser({
      headers: request.headers,
      body: { name },
    });
  }

  await profiles.updateOne(
    { userId: session.user.id },
    {
      $set: {
        phone,
        city,
        about,
        avatarUrl,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  return NextResponse.json({
    profile: { name: name ?? session.user.name, phone, city, about, avatarUrl },
  });
}
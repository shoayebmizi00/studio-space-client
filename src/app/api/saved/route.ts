import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";

const saved = db.collection("saved_studios");
const studios = db.collection("studios");

/* ------------------------------------------------------------------ */
/* GET /api/saved — the signed-in user's wishlist (studio ids)         */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to see your saved studios" }, { status: 401 });
  }

  const docs = await saved.find({ userId: session.user.id }).toArray();
  return NextResponse.json(docs.map((doc) => doc.studioId));
}

/* ------------------------------------------------------------------ */
/* POST /api/saved — save a studio (JWT cookie required, 401)          */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to save studios" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const studioId = body && typeof body.studioId === "string" ? body.studioId : "";
  if (!studioId || !ObjectId.isValid(studioId)) {
    return NextResponse.json({ error: "Choose a valid studio" }, { status: 400 });
  }

  const studio = await studios.findOne({ _id: new ObjectId(studioId) });
  if (!studio) {
    return NextResponse.json({ error: "Studio not found" }, { status: 404 });
  }

  // Do not save the same studio twice.
  const existing = await saved.findOne({ userId: session.user.id, studioId });
  if (!existing) {
    await saved.insertOne({
      userId: session.user.id,
      studioId,
      createdAt: new Date(),
    });
  }

  return NextResponse.json({ studioId }, { status: 201 });
}

/* ------------------------------------------------------------------ */
/* DELETE /api/saved — clear the whole wishlist                        */
/* ------------------------------------------------------------------ */

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to manage your saved studios" }, { status: 401 });
  }

  await saved.deleteMany({ userId: session.user.id });
  return NextResponse.json({ message: "Saved studios cleared" });
}

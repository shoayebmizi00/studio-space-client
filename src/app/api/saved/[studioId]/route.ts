import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";

const saved = db.collection("saved_studios");

type RouteContext = { params: Promise<{ studioId: string }> };

/* ------------------------------------------------------------------ */
/* DELETE /api/saved/[studioId] — remove one saved studio (401)        */
/* ------------------------------------------------------------------ */

export async function DELETE(request: Request, { params }: RouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to manage your saved studios" }, { status: 401 });
  }

  const { studioId } = await params;
  const result = await saved.deleteOne({ userId: session.user.id, studioId });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Studio is not in your saved list" }, { status: 404 });
  }

  return NextResponse.json({ message: "Removed from saved studios" });
}

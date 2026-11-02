import { ObjectId } from "mongodb";
import { db } from "@/lib/auth";
import type { StudioListing } from "@/lib/api";

const studiosCollection = db.collection("studios");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeStudioDoc(doc: any): StudioListing {
  const location = doc.location ?? {};
  const pricing = doc.pricing ?? {};
  const capacity = doc.capacity ?? {};
  const media = doc.media ?? {};
  const ratings = doc.ratings_and_reviews ?? {};
  const hourlyRate = doc.hourlyRate ?? pricing.hourly_rate ?? doc.price ?? 0;
  const maxCapacity = doc.maxCapacity ?? capacity.max_capacity ?? doc.capacity ?? 0;
  const createdAt = doc.createdAt
    ? new Date(doc.createdAt).toISOString()
    : new Date().toISOString();
  const updatedAt = doc.updatedAt
    ? new Date(doc.updatedAt).toISOString()
    : createdAt;

  return {
    _id: String(doc._id),
    id: doc.id ?? String(doc._id),
    name: doc.name ?? doc.title ?? "",
    category: doc.category ?? "",
    badge: doc.badge,
    shortDescription: doc.shortDescription ?? doc.short_description ?? "",
    fullDescription: doc.fullDescription ?? doc.description ?? "",
    country: doc.country ?? location.country ?? "",
    city: doc.city ?? location.city ?? "",
    streetAddress: doc.streetAddress ?? location.address ?? "",
    latitude: doc.latitude ?? location.latitude,
    longitude: doc.longitude ?? location.longitude,
    hourlyRate: Number(hourlyRate) || 0,
    price: Number(hourlyRate) || 0,
    securityDeposit: Number(doc.securityDeposit ?? pricing.security_deposit) || 0,
    maxCapacity: Number(maxCapacity) || 0,
    capacity: Number(maxCapacity) || 0,
    rules: doc.rules ?? "",
    cancellationPolicy: doc.cancellationPolicy ?? doc.cancellation_policy ?? "",
    amenities: Array.isArray(doc.amenities) ? doc.amenities : [],
    equipment: Array.isArray(doc.equipment) ? doc.equipment : [],
    coverImage: doc.coverImage ?? media.cover_image ?? null,
    gallery: Array.isArray(doc.gallery)
      ? doc.gallery
      : Array.isArray(media.gallery)
        ? media.gallery
        : [],
    rating: Number(doc.rating ?? ratings.average_rating) || 0,
    reviews: Number(doc.reviews ?? ratings.review_count) || 0,
    status: doc.status ?? "published",
    createdAt,
    updatedAt,
  };
}

export async function fetchPublishedStudios(): Promise<StudioListing[]> {
  const docs = await studiosCollection
    .find({
      status: { $in: ["published", "Published", "Verified", "verified"] },
    })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(normalizeStudioDoc);
}

export async function fetchStudioById(id: string): Promise<StudioListing | null> {
  if (!id) return null;

  // Try matching ObjectId, or string id
  let query: Record<string, unknown> = { id };
  if (ObjectId.isValid(id)) {
    query = {
      $or: [{ _id: new ObjectId(id) }, { id }],
    };
  }

  const doc = await studiosCollection.findOne(query);
  if (!doc) return null;

  return normalizeStudioDoc(doc);
}


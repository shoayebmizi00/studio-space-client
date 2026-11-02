/* ------------------------------------------------------------------ */
/* Studio listing type — the document shape stored by                  */
/* ../studio-space-server in MongoDB (`studio-space-a8.studios`).      */
/* ------------------------------------------------------------------ */

export type StudioListing = {
  _id: string;
  id?: string;
  name: string;
  category: string;
  badge?: string;
  shortDescription: string;
  fullDescription: string;
  country: string;
  city: string;
  streetAddress: string;
  latitude?: number;
  longitude?: number;
  hourlyRate: number;
  price?: number;
  securityDeposit: number;
  maxCapacity: number;
  capacity?: number;
  rules: string;
  cancellationPolicy: string;
  amenities: string[];
  equipment: string[];
  coverImage: string | null;
  gallery: string[];
  rating?: number;
  reviews?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

/* ------------------------------------------------------------------ */
/* Client                                                              */
/* ------------------------------------------------------------------ */

// Express server in ../studio-space-server. Override with
// NEXT_PUBLIC_API_URL in .env when the backend is deployed elsewhere.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getApiUrl(): string {
  return API_URL;
}

/** All published studio listings, newest first. Throws on network/server error. */
export async function getStudios(): Promise<StudioListing[]> {
  const res = await fetch(`${API_URL}/studios`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
  return res.json();
}

/** One listing by Mongo id, or null when it does not exist. */
export async function getStudio(id: string): Promise<StudioListing | null> {
  const res = await fetch(`${API_URL}/studios/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
  return res.json();
}

/* ------------------------------------------------------------------ */
/* Small view helpers shared across cards and the details page         */
/* ------------------------------------------------------------------ */

export function studioLocation(studio: StudioListing): string {
  return [studio.city, studio.country].filter(Boolean).join(", ");
}

export function studioGallery(studio: StudioListing): string[] {
  return [studio.coverImage, ...studio.gallery].filter(
    (src): src is string => Boolean(src)
  );
}

export function studioTagline(studio: StudioListing): string {
  return studio.fullDescription.trim() || studio.shortDescription.trim();
}

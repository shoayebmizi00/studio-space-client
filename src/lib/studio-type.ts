// This file only contains a type (no code that runs).
// It describes the shape of one studio listing that the
// Express server (studio-space-server) sends as JSON.

export type Studio = {
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
  rating: number;
  reviews: number;
  createdAt: string;
};

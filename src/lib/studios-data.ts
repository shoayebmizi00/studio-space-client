import type { StaticImageData } from "next/image";

import img1 from "@/assests/1.png";
import img2 from "@/assests/2.png";
import img3 from "@/assests/3.png";
import img4 from "@/assests/4.png";
import img5 from "@/assests/5.png";
import img6 from "@/assests/6.png";
import img7 from "@/assests/7.png";
import img8 from "@/assests/8.png";

/* ------------------------------------------------------------------ */
/* Filter option lists                                                 */
/* ------------------------------------------------------------------ */

export const categoryOptions = [
  "All categories",
  "Photography",
  "Film stage",
  "Podcast",
  "Music suite",
  "Art workshop",
  "Content studio",
  "Rehearsal",
  "Event space",
] as const;

export const ratingOptions = [
  { label: "Any", value: 0 },
  { label: "4.0+", value: 4 },
  { label: "4.5+", value: 4.5 },
] as const;

export const capacityOptions = [
  { label: "Any size", value: 0 },
  { label: "3+ people", value: 3 },
  { label: "6+ people", value: 6 },
  { label: "12+ people", value: 12 },
  { label: "25+ people", value: 25 },
] as const;

export const amenityOptions = [
  "Lighting",
  "Soundproofing",
  "Wi-Fi",
  "Air Conditioning",
  "Parking",
  "Green Screen",
  "Makeup Room",
  "Kitchen",
  "Changing Room",
  "Equipment Rental",
] as const;

/* ------------------------------------------------------------------ */
/* Studios                                                             */
/* ------------------------------------------------------------------ */

export type Studio = {
  id: string;
  name: string;
  category: string;
  badge: string;
  tagline: string;
  image: StaticImageData;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  capacity: number;
  addedAt: number;
  amenities: string[];
};

export const studios: Studio[] = [
  {
    id: "atelier-nine",
    name: "Atelier Nine",
    category: "Art workshop",
    badge: "Art work shop",
    tagline: "Top-floor workshop with north light, easels and a ceramics corner.",
    image: img4,
    location: "Lisbon, Portugal",
    rating: 5,
    reviews: 21,
    price: 38,
    capacity: 10,
    addedAt: 6,
    amenities: ["Lighting", "Wi-Fi", "Makeup Room", "Kitchen", "Equipment Rental"],
  },
  {
    id: "daylight-loft",
    name: "Daylight Loft Studio",
    category: "Photography",
    badge: "Photography",
    tagline: "Sun-drenched Arts District loft with a 5m cyclorama and a full strobe kit.",
    image: img8,
    location: "Los Angeles, United States",
    rating: 5,
    reviews: 21,
    price: 85,
    capacity: 12,
    addedAt: 5,
    amenities: ["Lighting", "Wi-Fi", "Parking", "Changing Room", "Equipment Rental"],
  },
  {
    id: "signal-room",
    name: "Signal Room Podcast Studio",
    category: "Podcast",
    badge: "Podcast",
    tagline: "Treatment-led podcast room with four mics, RØDECaster and a producer desk.",
    image: img6,
    location: "London, United Kingdom",
    rating: 5,
    reviews: 21,
    price: 45,
    capacity: 4,
    addedAt: 4,
    amenities: ["Soundproofing", "Wi-Fi", "Air Conditioning", "Equipment Rental"],
  },
  {
    id: "studio-fieldnote",
    name: "Studio Fieldnote",
    category: "Content studio",
    badge: "Content studio",
    tagline: "Creator garage setup with a ring-light bay, prop shelf and soft natural light.",
    image: img3,
    location: "Austin, United States",
    rating: 5,
    reviews: 21,
    price: 65,
    capacity: 8,
    addedAt: 3,
    amenities: ["Lighting", "Wi-Fi", "Air Conditioning", "Kitchen"],
  },
  {
    id: "foundry-hall",
    name: "Foundry Production Hall",
    category: "Event space",
    badge: "Event space",
    tagline: "Raw industrial hall with rigging, steel columns and room for 120 guests.",
    image: img1,
    location: "Chicago, United States",
    rating: 5,
    reviews: 21,
    price: 180,
    capacity: 60,
    addedAt: 2,
    amenities: ["Lighting", "Air Conditioning", "Parking", "Kitchen", "Equipment Rental"],
  },
  {
    id: "northline-stage",
    name: "Northline Sound Stage",
    category: "Film stage",
    badge: "Film stage",
    tagline: "Full-height sound stage with a 40ft green screen and lighting truss overhead.",
    image: img7,
    location: "New York, United States",
    rating: 5,
    reviews: 21,
    price: 240,
    capacity: 30,
    addedAt: 1,
    amenities: ["Green Screen", "Lighting", "Parking", "Makeup Room", "Changing Room", "Equipment Rental"],
  },
  {
    id: "arcade-suite",
    name: "Arcade Recording Suite",
    category: "Music suite",
    badge: "Music suite",
    tagline: "Dark-wood control room built around a vintage console and tube outboard.",
    image: img5,
    location: "Berlin, Germany",
    rating: 4.5,
    reviews: 21,
    price: 120,
    capacity: 6,
    addedAt: 0,
    amenities: ["Soundproofing", "Wi-Fi", "Air Conditioning", "Equipment Rental"],
  },
  {
    id: "parallax-room",
    name: "Parallax Rehearsal Room",
    category: "Rehearsal",
    badge: "Rehearsal",
    tagline: "Barred rehearsal space with sprung floor, mirrored wall and tall windows.",
    image: img2,
    location: "Toronto, Canada",
    rating: 4.5,
    reviews: 21,
    price: 40,
    capacity: 15,
    addedAt: 7,
    amenities: ["Soundproofing", "Wi-Fi", "Parking", "Kitchen"],
  },
];

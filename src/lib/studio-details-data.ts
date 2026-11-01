import type { StaticImageData } from "next/image";
import type { Studio } from "@/lib/studios-data";

import img2 from "@/assests/2.png";
import img3 from "@/assests/3.png";
import img4 from "@/assests/4.png";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Review = {
  initials: string;
  name: string;
  date: string;
  rating: number;
  text: string;
};

export type StudioDetail = {
  verified: boolean;
  gallery: StaticImageData[];
  about: string[];
  spaceType: string;
  rateBasis: string;
  deposit: number;
  amenities: string[];
  equipment: string[];
  rules: string;
  cancellation: string;
  host: { initials: string; name: string; since: string; note: string };
  city: string;
  street: string;
  accessNote: string;
  distribution: number[];
  reviews: Review[];
};

/* ------------------------------------------------------------------ */
/* Per-studio details                                                  */
/* ------------------------------------------------------------------ */

const atelierNine: StudioDetail = {
  verified: true,
  gallery: [img4, img2, img3],
  about: [
    "A calm, whitewashed workshop on the top floor of a converted textile building. Six professional easels, deep sinks, drying racks and a separate ceramics corner with a kiln make it equally useful for painting sessions and small classes.",
    "The windows face north, so the light stays even all day. Tables can be cleared to create a clean shooting area for documenting finished work.",
  ],
  spaceType: "Art workshop",
  rateBasis: "By the hour",
  deposit: 40,
  amenities: ["Wi-Fi", "Kitchen", "Parking", "Changing Room"],
  equipment: ["Projector", "Backdrops"],
  rules:
    "Solvents only in the ventilated corner. Clean brushes in the sink, never the ceramics basin. Kiln use must be booked with the host in advance.",
  cancellation:
    "Flexible — free cancellation up to 24 hours before the session. Inside 24 hours the deposit is retained.",
  host: {
    initials: "IF",
    name: "Ines Ferreira",
    since: "Host since October 2026",
    note: "Identity and listing reviewed",
  },
  city: "Lisbon, Portugal",
  street: "Rua da Boavista 92, Cais do Sodré",
  accessNote: "Exact access details are shared by the host after a booking is confirmed.",
  distribution: [2, 0, 0, 0, 0],
  reviews: [
    {
      initials: "CS",
      name: "Clara Sousa",
      date: "Sat, Oct 31, 2026",
      rating: 5,
      text: "Perfect north light all day and the sinks are actually usable. We ran a five-person workshop comfortably.",
    },
    {
      initials: "DL",
      name: "Duarte Lima",
      date: "Sat, Oct 31, 2026",
      rating: 5,
      text: "Kiln access and drying racks made our ceramics session easy. Will rebook next month.",
    },
  ],
};

const genericDetails: Record<string, StudioDetail> = {
  "atelier-nine": atelierNine,
};

/**
 * Full detail content for a studio. Studios with a hand-written entry get it;
 * the rest fall back to sensible copy derived from their listing fields.
 */
export function getStudioDetail(studio: Studio): StudioDetail {
  const specific = genericDetails[studio.id];
  if (specific) return specific;

  return {
    verified: studio.rating >= 4.5,
    gallery: [studio.image, img3, img2],
    about: [
      `${studio.tagline} The space is looked after by the host directly, so the rooms stay in the condition you see here.`,
      "Send the host a note through the booking request and they will confirm availability within a day.",
    ],
    spaceType: studio.category,
    rateBasis: "By the hour",
    deposit: 40,
    amenities: studio.amenities,
    equipment: ["Backdrops", "Camera & tripod"],
    rules: "Leave the space as you found it. Load-in through the main entrance.",
    cancellation:
      "Flexible — free cancellation up to 24 hours before the session. Inside 24 hours the deposit is retained.",
    host: {
      initials: studio.name.slice(0, 2).toUpperCase(),
      name: "Studio host",
      since: "Host since 2026",
      note: "Identity and listing reviewed",
    },
    city: studio.location,
    street: studio.location,
    accessNote: "Exact access details are shared by the host after a booking is confirmed.",
    distribution: [studio.reviews, 0, 0, 0, 0],
    reviews: [
      {
        initials: "RJ",
        name: "Recurring client",
        date: "Fri, Oct 23, 2026",
        rating: studio.rating,
        text: `Exactly as described. ${studio.name} is easy to work in and the booking process was smooth.`,
      },
    ],
  };
}

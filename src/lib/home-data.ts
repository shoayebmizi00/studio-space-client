import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Clapperboard,
  Mic,
  Music,
  Palette,
  Video,
  Drum,
  CalendarDays,
  Search,
  CalendarCheck2,
  Sparkles,
  Upload,
  CalendarRange,
  Wallet,
  CalendarClock,
  Star,
  Tag,
  LayoutDashboard,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Images (local assets from src/assests)                              */
/* ------------------------------------------------------------------ */

import img1 from "@/assests/1.png";
import img2 from "@/assests/2.png";
import img3 from "@/assests/3.png";
import img4 from "@/assests/4.png";
import img5 from "@/assests/5.png";
import img6 from "@/assests/6.png";
import img7 from "@/assests/7.png";
import img8 from "@/assests/8.png";

export const images: Record<
  "hero" | "host" | "astral" | "daylight" | "foundry" | "ristorare" | "northbound" | "signal",
  StaticImageData
> = {
  hero: img8,
  host: img5,
  astral: img4,
  daylight: img2,
  foundry: img1,
  ristorare: img3,
  northbound: img7,
  signal: img6,
};

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export type Category = {
  icon: LucideIcon;
  name: string;
  count: number;
};

export const categories: Category[] = [
  { icon: Camera, name: "Photography", count: 14 },
  { icon: Clapperboard, name: "Film stage", count: 7 },
  { icon: Mic, name: "Podcast", count: 9 },
  { icon: Music, name: "Music studio", count: 11 },
  { icon: Palette, name: "Art workshop", count: 6 },
  { icon: Video, name: "Content studio", count: 12 },
  { icon: Drum, name: "Rehearsal", count: 5 },
  { icon: CalendarDays, name: "Event space", count: 8 },
];

/* ------------------------------------------------------------------ */
/* Featured spaces                                                     */
/* ------------------------------------------------------------------ */

export type Space = {
  name: string;
  location: string;
  badge: string;
  image: StaticImageData;
  rating: number;
  reviews: number;
  price: number;
  guests: number;
};

export const featuredSpaces: Space[] = [
  {
    name: "Astral Arora",
    location: "Los Angeles, United States",
    badge: "New",
    image: images.astral,
    rating: 4.9,
    reviews: 132,
    price: 88,
    guests: 4,
  },
  {
    name: "Daylight Loft Studio",
    location: "Los Angeles, United States",
    badge: "Photography",
    image: images.daylight,
    rating: 4.8,
    reviews: 56,
    price: 95,
    guests: 6,
  },
  {
    name: "Foundry Production Hall",
    location: "Los Angeles, United States",
    badge: "Event space",
    image: images.foundry,
    rating: 5.0,
    reviews: 48,
    price: 349,
    guests: 40,
  },
  {
    name: "Studio Ristorare",
    location: "Los Angeles, United States",
    badge: "Content studio",
    image: images.ristorare,
    rating: 4.7,
    reviews: 89,
    price: 65,
    guests: 3,
  },
  {
    name: "Northbound Sound Stage",
    location: "Los Angeles, United States",
    badge: "Green screen",
    image: images.northbound,
    rating: 4.9,
    reviews: 61,
    price: 140,
    guests: 8,
  },
  {
    name: "Signal Room Podcast Studio",
    location: "Los Angeles, United States",
    badge: "Podcast",
    image: images.signal,
    rating: 5.0,
    reviews: 73,
    price: 45,
    guests: 2,
  },
];

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

export type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const steps: Step[] = [
  {
    icon: Search,
    title: "Search the marketplace",
    description:
      "Filter by location, price, or studio type and see real-time availability. Every result is a real, publishable space.",
  },
  {
    icon: CalendarCheck2,
    title: "Pick a slot that works",
    description:
      "Pick your hours, request the booking, or book instantly and get confirmation in real time. No more back-and-forth.",
  },
  {
    icon: Sparkles,
    title: "Create something great",
    description:
      "Show up, shoot, and leave the space how you found it. Reviews keep both sides honest, and the invoice is already settled.",
  },
];

export const hostCards: Step[] = [
  {
    icon: Upload,
    title: "Publish your studio",
    description:
      "Post your space in under ten minutes: photos, pricing, rules, instant or request-to-book.",
  },
  {
    icon: CalendarRange,
    title: "Open your calendar",
    description:
      "Sync availability in seconds. Bookings only appear where you're actually free.",
  },
  {
    icon: Wallet,
    title: "Get paid for the hours",
    description:
      "Payouts arrive automatically with every confirmed booking in your dashboard.",
  },
];

/* ------------------------------------------------------------------ */
/* Why StudioSpace                                                     */
/* ------------------------------------------------------------------ */

export const whyCards: Step[] = [
  {
    icon: CalendarClock,
    title: "Real availability only",
    description:
      "If a room shows open here, someone can actually book it. No hopeful listings, no stale times.",
  },
  {
    icon: Star,
    title: "Reviews from real bookings",
    description:
      "You only see reviews from creators who have actually shot in the space. No foggy, anonymous scores.",
  },
  {
    icon: Tag,
    title: "Transparent pricing",
    description:
      "Hourly rates, extra fees, and house rules are all disclosed before you book. No surprises at check-in.",
  },
  {
    icon: LayoutDashboard,
    title: "One dashboard, both roles",
    description:
      "Your sessions as a host and your bookings as a renter live in the same account. No second login to forget.",
  },
];

/* ------------------------------------------------------------------ */
/* Become a host                                                       */
/* ------------------------------------------------------------------ */

export const hostPerks = [
  "Payouts on a consolidated billing cycle",
  "Full calendar sync and black-out protection",
  "Profile, reputation, and reporting dashboard",
];

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We found a full production stage for a two-day shoot in one session. Confirmation came the same evening. We were filming the next afternoon. My studio is often booked out weeks ahead.",
    name: "Tomás Kelemen",
    role: "Creative Director, Vessel Film",
  },
  {
    quote:
      "I run two daylight studios. The calendar and the deposits used to eat my evenings. StudioSpace put both on autopilot.",
    name: "Victoria Clears",
    role: "Studio host",
  },
  {
    quote:
      "As a podcast team we book six rooms a month. Having every booking, invoice, and receipt in one dashboard removes a year-end nightmare we used to dread.",
    name: "Marta Koprowski",
    role: "Head of Content, Signal Studio",
  },
];

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "What's StudioSpace?",
    answer:
      "A marketplace for booking creative workspaces by the hour — photo stages, film sets, music and podcast studios, workshops, and event rooms — with live pricing, real availability, and instant checkout.",
  },
  {
    question: "Who can use StudioSpace?",
    answer:
      "Any creator, producer, or team that needs space by the hour, and any studio owner with spare hours to fill. One account covers both sides.",
  },
  {
    question: "Do I need separate accounts for both?",
    answer:
      "No. A single account lets you book spaces as a creator and list your own space as a host. Your dashboard switches between the two roles.",
  },
  {
    question: "How do bookings work?",
    answer:
      "Pick your hours and either request the booking or book instantly, depending on the host's settings. Confirmation is real time, and payment, invoicing, and payouts are handled for you.",
  },
  {
    question: "Can I visit before I book?",
    answer:
      "Many hosts offer a short preview visit for longer or recurring bookings. Just send a message through the studio's page and arrange a time.",
  },
];

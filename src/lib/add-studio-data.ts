/* ------------------------------------------------------------------ */
/* Step metadata                                                       */
/* ------------------------------------------------------------------ */

export const STEPS = [
  {
    title: "Basic information",
    subtitle: "Name the space and describe what makes it useful.",
  },
  {
    title: "Location",
    subtitle: "Where the studio is, and what creators should know.",
  },
  {
    title: "Pricing",
    subtitle: "Hourly rate, deposit and capacity.",
  },
  {
    title: "Images",
    subtitle: "A cover shot and gallery photos.",
  },
  {
    title: "Amenities & equipment",
    subtitle: "What is already in the room.",
  },
  {
    title: "Rules & policy",
    subtitle: "How the space should be treated.",
  },
] as const;

export const TOTAL_STEPS = STEPS.length;

/* ------------------------------------------------------------------ */
/* Options                                                             */
/* ------------------------------------------------------------------ */

export const categoryOptions = [
  "Photography",
  "Film stage",
  "Podcast",
  "Music suite",
  "Art workshop",
  "Content studio",
  "Rehearsal",
  "Event space",
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

export const equipmentOptions = [
  "Softbox lights",
  "Strobe lighting",
  "C-stands",
  "Backdrops",
  "Mixing console",
  "Studio monitors",
  "Condenser microphones",
  "Camera & tripod",
  "Ring light",
  "Cyclorama",
  "Projector",
  "PA system",
] as const;

export const cancellationPolicies = [
  "Flexible — free cancellation up to 24 hours",
  "Moderate — refund up to 48 hours before the session",
  "Strict — non-refundable once a booking is confirmed",
] as const;

/* ------------------------------------------------------------------ */
/* Prefilled example values (from the reference)                       */
/* ------------------------------------------------------------------ */

export const initialForm = {
  name: "Daylight Soft Corner",
  category: "Content studio",
  shortDescription: "This a facebook content type studio.",
  fullDescription:
    "This is a studio, which is use for content creator or influencer who are create content for facebook, instagram, tiktok, youtube etc.",
  country: "Bangladesh",
  city: "dhaka",
  streetAddress: "Dhaka, Bangladesh",
  latitude: "",
  longitude: "",
  hourlyRate: "50",
  securityDeposit: "10",
  maxCapacity: "12",
  rules: "No smoking. Load-in through the rear entrance. Leave the space as you found it.",
  cancellationPolicy: cancellationPolicies[0] as string,
};

export type AddStudioForm = typeof initialForm;

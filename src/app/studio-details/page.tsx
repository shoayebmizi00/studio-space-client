import type { Metadata } from "next";
import { getStudio } from "@/lib/api";
import { fetchStudioById } from "@/lib/studios-db";
import { StudioDetailsView } from "@/components/studio-details/studio-details-view";

export const metadata: Metadata = {
  title: "Studio details — StudioSpace",
  description:
    "Photos, amenities, rules, reviews and hourly pricing — request a booking directly from the studio page.",
};

export default async function StudioDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  let studio = null;

  try {
    studio = await getStudio(id ?? "");
  } catch {
    // If Express backend is offline, try direct DB lookup
  }

  if (!studio && id) {
    try {
      studio = await fetchStudioById(id);
    } catch {
      studio = null;
    }
  }

  if (!studio) {
    return <StudioDetailsView studio={null} />;
  }

  return <StudioDetailsView studio={studio} />;
}

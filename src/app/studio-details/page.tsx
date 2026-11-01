import type { Metadata } from "next";
import { studios } from "@/lib/studios-data";
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
  const studio = studios.find((s) => s.id === id) ?? studios[0];

  return <StudioDetailsView studio={studio} />;
}

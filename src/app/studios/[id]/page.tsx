import type { Metadata } from "next";
import type { Studio } from "@/lib/studio-type";
import { API_URL } from "@/lib/api-url";
import { StudioDetailsView } from "@/components/studio-details/studio-details-view";

export const metadata: Metadata = {
  title: "Studio details — StudioSpace",
  description:
    "Photos, amenities, rules, reviews and hourly pricing — request a booking directly from the studio page.",
};

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load this one studio straight from the Express server.
  let studio: Studio | null = null;

  if (id) {
    try {
      const res = await fetch(`${API_URL}/studios/${id}`, {
        cache: "no-store",
      });
      if (res.ok) {
        studio = await res.json();
      }
    } catch {
      studio = null;
    }
  }

  if (!studio) {
    return <StudioDetailsView studio={null} />;
  }

  return <StudioDetailsView studio={studio} />;
}

import type { Metadata } from "next";
import { StudiosView } from "@/components/studios/studios-view";

export const metadata: Metadata = {
  title: "Explore Creative Studios — StudioSpace",
  description:
    "Browse verified creative studios with real availability, transparent hourly pricing and honest reviews from completed bookings.",
};

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <StudiosView initialCategory={category} />;
}

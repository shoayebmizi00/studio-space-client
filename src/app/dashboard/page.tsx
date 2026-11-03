import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard — StudioSpace",
  description: "Your StudioSpace overview: listings, bookings and quick actions.",
};

export default function DashboardPage() {
  return <DashboardView />;
}

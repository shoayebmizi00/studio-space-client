import type { Metadata } from "next";
import { MyBookingsView } from "@/components/my-bookings/my-bookings-view";

export const metadata: Metadata = {
  title: "My bookings — StudioSpace",
  description: "Track and manage your StudioSpace booking requests and sessions.",
};

export default function MyBookingsPage() {
  return <MyBookingsView />;
}
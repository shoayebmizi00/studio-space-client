import type { Metadata } from "next";
import { MyListingsView } from "@/components/my-listings/my-listings-view";

export const metadata: Metadata = {
  title: "My listings — StudioSpace",
  description: "Manage the studios you host on StudioSpace: update details or remove a listing.",
};

export default function MyListingsPage() {
  return <MyListingsView />;
}

import type { Metadata } from "next";
import { HowItWorksView } from "@/components/how-it-works/how-it-works-view";

export const metadata: Metadata = {
  title: "How It Works — StudioSpace",
  description:
    "A marketplace built around real availability and real work. How booking, hosting, pricing, and cancellations work on StudioSpace.",
};

export default function HowItWorksPage() {
  return <HowItWorksView />;
}

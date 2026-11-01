import type { Metadata } from "next";
import { AboutView } from "@/components/about/about-view";

export const metadata: Metadata = {
  title: "About — StudioSpace",
  description:
    "Creative work deserves a better room to happen in. Meet the team and the principles behind StudioSpace.",
};

export default function AboutPage() {
  return <AboutView />;
}

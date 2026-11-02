import type { Metadata } from "next";
import { SavedStudiosView } from "@/components/saved-studios/saved-studios-view";

export const metadata: Metadata = {
  title: "Saved Studios — StudioSpace",
  description:
    "Your saved creative studios. Heart a space on any listing to keep it here for easy access.",
};

export default function SavedStudiosPage() {
  return <SavedStudiosView />;
}

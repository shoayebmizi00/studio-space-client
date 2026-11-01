import type { Metadata } from "next";
import { AddStudioView } from "@/components/add-studio/add-studio-view";

export const metadata: Metadata = {
  title: "Add a studio — StudioSpace",
  description:
    "List your studio on StudioSpace in six steps: basics, location, pricing, images, amenities and rules.",
};

export default function AddStudioPage() {
  return <AddStudioView />;
}

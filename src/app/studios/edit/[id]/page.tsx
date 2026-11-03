import type { Metadata } from "next";
import { EditStudioView } from "@/components/edit-studio/edit-studio-view";

export const metadata: Metadata = {
  title: "Update studio — StudioSpace",
  description: "Edit the details of one of your StudioSpace listings.",
};

export default function EditStudioPage() {
  return <EditStudioView />;
}

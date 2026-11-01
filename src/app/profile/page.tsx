import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "Profile — StudioSpace",
  description:
    "How hosts and creators see you across StudioSpace. Update your profile details and account type.",
};

export default function ProfilePage() {
  return <ProfileView />;
}

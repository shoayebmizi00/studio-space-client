import type { Metadata } from "next";
import { SignInView } from "@/components/auth/sign-in-view";

export const metadata: Metadata = {
  title: "Sign in — StudioSpace",
  description: "Sign in to book studios by the hour or manage your listings.",
};

export default function SignInPage() {
  return <SignInView />;
}

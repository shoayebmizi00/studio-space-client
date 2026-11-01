import type { Metadata } from "next";
import { SignUpView } from "@/components/auth/sign-up-view";

export const metadata: Metadata = {
  title: "Create an account — StudioSpace",
  description:
    "Create a StudioSpace account to book studios by the hour or list your own space.",
};

export default function SignUpPage() {
  return <SignUpView />;
}

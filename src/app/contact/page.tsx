import type { Metadata } from "next";
import { ContactView } from "@/components/contact/contact-view";

export const metadata: Metadata = {
  title: "Contact — StudioSpace",
  description:
    "Talk to a human about your space, listing, or booking. The team replies within one business day.",
};

export default function ContactPage() {
  return <ContactView />;
}

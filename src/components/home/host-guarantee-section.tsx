import { BadgeCheck, Headphones, ShieldCheck, Wrench } from "lucide-react";
import { SectionHeader } from "./section-header";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    description:
      "Every booking includes host liability cover, so an accident on set does not become your problem.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    description:
      "Hosts and creators verify their identity before booking, so you always know who is on the other side.",
  },
  {
    icon: Wrench,
    title: "Equipment safety",
    description:
      "Listings are reviewed for working gear and safe wiring, and damage deposits are held on every session.",
  },
  {
    icon: Headphones,
    title: "24/7 host support",
    description:
      "Real people answer around the clock — before, during and after your shoot, wherever you are.",
  },
];

/**
 * Static assurance section: why creators and hosts can trust the platform.
 */
export function HostGuaranteeSection() {
  return (
    <section className="bg-secondary/60 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Host guarantee & creator support"
          title="Book with confidence, host with backup"
          description="StudioSpace backs every session with real protections for the space and the people in it."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-6"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <item.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

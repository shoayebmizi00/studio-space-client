import { SectionHeader } from "./section-header";
import { whyCards } from "@/lib/home-data";

export function WhyStudiospaceSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:pb-24">
      <SectionHeader
        eyebrow="Why StudioSpace"
        title="Built for people who actually produce work"
        description="Every feature exists to remove friction between a good idea and a closed room."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whyCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-14 rounded-3xl border border-border/70 bg-card p-5"
          >
            <span className="grid size-9 place-items-center rounded-lg border border-border text-foreground/70">
              <card.icon className="size-4" />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold tracking-tight">{card.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

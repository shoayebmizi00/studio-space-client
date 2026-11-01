import { SectionHeader } from "./section-header";
import { SpaceCard } from "./space-card";
import { featuredSpaces } from "@/lib/home-data";

export function FeaturedSpacesSection() {
  return (
    <section className="bg-secondary/60 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Featured this week"
          title="Spaces creators are booking now"
          description="New on StudioSpace: curated backstage-to-darkroom setups, from boutique photo lofts to production studios."
          action={
            <a
              href="#explore"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium transition-colors hover:border-foreground/25"
            >
              Browse all
              <span aria-hidden>→</span>
            </a>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSpaces.map((space) => (
            <SpaceCard key={space.name} space={space} />
          ))}
        </div>
      </div>
    </section>
  );
}

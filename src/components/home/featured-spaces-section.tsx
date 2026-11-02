import { SectionHeader } from "./section-header";
import { SpaceCard } from "./space-card";
import { getStudios } from "@/lib/api";
import type { StudioListing } from "@/lib/api";

export async function FeaturedSpacesSection() {
  let studios: StudioListing[] = [];
  let unavailable = false;

  try {
    studios = (await getStudios()).slice(0, 6);
  } catch {
    unavailable = true;
  }

  return (
    <section className="bg-secondary/60 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Featured this week"
          title="Spaces creators are booking now"
          description="Browse studios published by hosts on StudioSpace."
          action={
            <a
              href="/studios"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium transition-colors hover:border-foreground/25"
            >
              Browse all
              <span aria-hidden>→</span>
            </a>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <SpaceCard key={studio._id || studio.id} studio={studio} />
          ))}
        </div>
        {unavailable ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Studios are temporarily unavailable. Please try again later.
          </p>
        ) : null}
        {!unavailable && studios.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            No studios have been published yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}

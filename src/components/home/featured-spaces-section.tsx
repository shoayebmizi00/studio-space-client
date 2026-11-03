import { SectionHeader } from "./section-header";
import { SpaceCard } from "./space-card";
import type { Studio } from "@/lib/studio-type";

export async function FeaturedSpacesSection() {
  // Load the newest studios straight from the Express server.
  let studios: Studio[] = [];
  let unavailable = false;

  try {
    const res = await fetch("http://localhost:5000/studios", { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Request failed");
    }
    studios = await res.json();
  } catch {
    unavailable = true;
  }

  // Show at most 6 cards.
  studios = studios.slice(0, 6);

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

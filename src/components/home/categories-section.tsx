import {
  ArrowRight,
  Camera,
  CalendarDays,
  Clapperboard,
  Drum,
  Mic,
  Music,
  Palette,
  Shapes,
  Video,
} from "lucide-react";
import { SectionHeader } from "./section-header";
import type { Studio } from "@/lib/studio-type";

function categoryIcon(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("photo") || normalized.includes("camera")) return Camera;
  if (normalized.includes("film") || normalized.includes("cinema")) return Clapperboard;
  if (normalized.includes("podcast") || normalized.includes("audio")) return Mic;
  if (normalized.includes("music") || normalized.includes("recording")) return Music;
  if (normalized.includes("art") || normalized.includes("craft") || normalized.includes("ceramic")) return Palette;
  if (normalized.includes("rehearsal")) return Drum;
  if (normalized.includes("event") || normalized.includes("production")) return CalendarDays;
  if (normalized.includes("content") || normalized.includes("video")) return Video;
  return Shapes;
}

export async function CategoriesSection() {
  // Load all studios straight from the Express server.
  let studios: Studio[] | null = null;

  try {
    const res = await fetch("http://localhost:5000/studios", { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Request failed");
    }
    studios = await res.json();
  } catch {
    studios = null;
  }

  // Count how many studios belong to each category.
  const counts: { [name: string]: number } = {};
  if (studios) {
    for (const studio of studios) {
      const category = studio.category.trim();
      if (category) {
        counts[category] = (counts[category] || 0) + 1;
      }
    }
  }

  // Biggest categories first.
  const categoryCounts = Object.entries(counts).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );

  return (
    <section id="explore" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeader
        eyebrow="Browse by category"
        title="Every kind of creative space"
        description="Explore our listing for every stage of production — filter by what your next shoot or event actually needs."
        action={
          <a
            href="/studios"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-opacity hover:opacity-70"
          >
            View all studios
            <ArrowRight className="size-3.5" />
          </a>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categoryCounts.map(([name, count]) => {
          const Icon = categoryIcon(name);
          return (
          <a
            key={name}
            href={`/studios?category=${encodeURIComponent(name)}`}
            className="group flex items-start gap-3.5 rounded-2xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md hover:shadow-black/5"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-foreground/70 transition-colors group-hover:border-foreground/30 group-hover:text-foreground">
              <Icon className="size-4" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm font-semibold tracking-tight">
                {name}
              </span>
              <span className="text-xs text-muted-foreground">
                {count} {count === 1 ? "studio" : "studios"}
              </span>
            </span>
          </a>
          );
        })}
      </div>
      {studios === null ? (
        <p className="mt-5 text-sm text-muted-foreground">Categories are temporarily unavailable.</p>
      ) : categoryCounts.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">Studios will appear here when hosts publish listings.</p>
      ) : null}
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./section-header";
import { categories } from "@/lib/home-data";
import { getStudios } from "@/lib/api";
import type { StudioListing } from "@/lib/api";

export async function CategoriesSection() {
  let studios: StudioListing[] | null = null;

  try {
    studios = await getStudios();
  } catch {
    studios = null;
  }

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
        {categories.map((category) => (
          <a
            key={category.name}
            href="/studios"
            className="group flex items-start gap-3.5 rounded-2xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md hover:shadow-black/5"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-foreground/70 transition-colors group-hover:border-foreground/30 group-hover:text-foreground">
              <category.icon className="size-4" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm font-semibold tracking-tight">
                {category.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {studios
                  ? `${studios.filter((studio) => studio.category === category.name).length} studios`
                  : "Browse studios"}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

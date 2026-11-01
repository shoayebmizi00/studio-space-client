import Image from "next/image";
import { MapPin, Users, ArrowUpRight } from "lucide-react";
import type { Space } from "@/lib/home-data";
import { StarRating } from "./star-rating";

export function SpaceCard({ space }: { space: Space }) {
  return (
    <article className="group flex flex-col rounded-3xl bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={space.image}
          alt={space.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="rounded-2xl object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground backdrop-blur">
          {space.badge}
        </span>

        <button
          type="button"
          aria-label={`View ${space.name}`}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-foreground backdrop-blur transition-transform hover:scale-105"
        >
          <ArrowUpRight className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2 px-2 pb-2 pt-4">
        <h3 className="text-[15px] font-semibold tracking-tight">{space.name}</h3>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {space.location}
        </p>

        <StarRating rating={space.rating} reviews={space.reviews} className="mt-1" />

        <div className="mt-2 flex items-end justify-between border-t border-border/60 pt-3">
          <p className="text-[15px] font-semibold tracking-tight">
            ${space.price}
            <span className="text-xs font-normal text-muted-foreground"> /hour</span>
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {space.guests}
          </p>
        </div>
      </div>
    </article>
  );
}

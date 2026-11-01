import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import type { Studio } from "@/lib/studios-data";
import { Stars } from "./studio-card";

export function StudioListCard({ studio }: { studio: Studio }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card sm:flex-row">
      {/* Image */}
      <div className="relative aspect-[2/1] shrink-0 sm:aspect-square sm:w-64 lg:w-72">
        <Image
          src={studio.image}
          alt={studio.name}
          fill
          sizes="(max-width: 640px) 100vw, 288px"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5 sm:flex-row sm:items-stretch sm:justify-between sm:p-6">
        <div className="flex min-w-0 flex-col">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {studio.category}
          </p>
          <h3 className="text-lg font-semibold tracking-tight">
            {studio.name}
          </h3>
          <p className="mt-1.5 line-clamp-1 text-[13px] text-muted-foreground sm:line-clamp-2">
            {studio.tagline}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 sm:pt-5">
            <span className="flex items-center gap-1.5 text-[13px] text-foreground/75">
              <MapPin className="size-3.5 text-muted-foreground" />
              {studio.location.split(",")[0]}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-foreground/75">
              <Users className="size-3.5 text-muted-foreground" />
              up to {studio.capacity}
            </span>
            <div className="flex items-center gap-2">
              {studio.amenities.slice(0, 2).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-foreground/70"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Rating + price column */}
        <div className="flex items-end justify-between gap-6 sm:flex-col sm:items-end sm:justify-between">
          <span className="flex items-center gap-2">
            <Stars rating={studio.rating} />
            <span className="text-[13px] font-semibold">
              {studio.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">({studio.reviews})</span>
          </span>
          <p className="text-[15px] font-semibold tracking-tight">
            ${studio.price}
            <span className="text-xs font-normal text-muted-foreground"> /hour</span>
          </p>
        </div>
      </div>
    </article>
  );
}

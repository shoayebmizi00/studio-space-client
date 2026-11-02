import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { Stars } from "@/components/studios/studio-card";
import type { StudioListing } from "@/lib/api";

export function SpaceCard({ studio }: { studio: StudioListing }) {
  const studioId = studio._id || studio.id || "";
  const image = studio.coverImage || studio.gallery?.[0];

  return (
    <article className="group flex flex-col rounded-3xl bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <Link href={`/studio-details?id=${studioId}`} aria-label={`View ${studio.name}`}>
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted">
          {image ? (
            <Image
              src={image}
              alt={studio.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="rounded-2xl object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : null}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground backdrop-blur">
            {studio.category}
          </span>
        </div>
      </Link>

      <div className="flex flex-col gap-2 px-2 pb-2 pt-4">
        <h3 className="text-[15px] font-semibold tracking-tight">
          <Link href={`/studio-details?id=${studioId}`}>{studio.name}</Link>
        </h3>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {[studio.city, studio.country].filter(Boolean).join(", ")}
        </p>

        {studio.reviews ? (
          <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Stars rating={studio.rating || 0} />
            {(studio.rating || 0).toFixed(1)} ({studio.reviews})
          </span>
        ) : null}

        <div className="mt-2 flex items-end justify-between border-t border-border/60 pt-3">
          <p className="text-[15px] font-semibold tracking-tight">
            ${studio.hourlyRate || studio.price || 0}
            <span className="text-xs font-normal text-muted-foreground"> /hour</span>
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {studio.maxCapacity || studio.capacity || 0} people
          </p>
        </div>
      </div>
    </article>
  );
}

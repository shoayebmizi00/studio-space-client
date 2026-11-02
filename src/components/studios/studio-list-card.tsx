import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Users } from "lucide-react";
import { Stars } from "./studio-card";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import type { StudioListing } from "@/lib/api";

interface StudioListCardProps {
  studio: StudioListing;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function StudioListCard({
  studio,
  isFavorite = false,
  onToggleFavorite,
}: StudioListCardProps) {
  const id = studio._id || studio.id || "";
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card sm:flex-row">
      {/* Image */}
      <div className="relative aspect-2/1 shrink-0 sm:aspect-square sm:w-64 lg:w-72">
        <Image
          src={studio.coverImage || studio.gallery?.[0] || "/placeholder.jpg"}
          alt={studio.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 288px"
          className="object-cover"
        />
        <Link
          href={`/studio-details?id=${studio.id}`}
          aria-label={`View ${studio.name}`}
          className="absolute inset-0"
        />
        {onToggleFavorite && (
          <Button
            type="button"
            aria-label={isFavorite ? "Remove from saved" : "Save studio"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(id);
            }}
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-foreground backdrop-blur transition-transform hover:scale-105"
          >
            <Heart
              className={cn("size-3.5 transition-colors", isFavorite && "fill-red-500 text-red-500")}
            />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5 sm:flex-row sm:items-stretch sm:justify-between sm:p-6">
        <div className="flex min-w-0 flex-col">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {studio.category}
          </p>
          <h3 className="text-lg font-semibold tracking-tight">
            <Link
              href={`/studio-details?id=${studio.id}`}
              className="transition-opacity hover:opacity-70"
            >
              {studio.name}
            </Link>
          </h3>
          <p className="mt-1.5 line-clamp-1 text-[13px] text-muted-foreground sm:line-clamp-2">
            {studio.shortDescription || studio.fullDescription}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 sm:pt-5">
            <span className="flex items-center gap-1.5 text-[13px] text-foreground/75">
              <MapPin className="size-3.5 text-muted-foreground" />
              {studio.city}, {studio.country}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-foreground/75">
              <Users className="size-3.5 text-muted-foreground" />
              up to {(studio.maxCapacity || studio.capacity)}
            </span>
            <div className="flex items-center gap-2">
              {studio.amenities?.slice(0, 2).map((amenity: string) => (
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
            <Stars rating={studio.rating || 0} />
            <span className="text-[13px] font-semibold">
              {studio.rating?.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">({studio.reviews})</span>
          </span>
          <p className="text-[15px] font-semibold tracking-tight">
            ${studio.hourlyRate || studio.price}
            <span className="text-xs font-normal text-muted-foreground"> /hour</span>
          </p>
        </div>
      </div>
    </article>
  );
}

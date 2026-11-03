import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Users, Star } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import type { Studio } from "@/lib/studio-type";

export function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.25 && rating % 1 <= 0.75;

  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) {
          return <Star key={i} className="size-3 fill-foreground text-foreground" />;
        }
        if (half && i === full) {
          return (
            <span key={i} className="relative inline-flex">
              <Star className="size-3 fill-border text-border" />
              <span className="absolute inset-0 w-1/2 overflow-hidden">
                <Star className="size-3 fill-foreground text-foreground" />
              </span>
            </span>
          );
        }
        return <Star key={i} className="size-3 fill-border text-border" />;
      })}
    </span>
  );
}

interface StudioCardProps {
  studio: Studio;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function StudioCard({
  studio,
  isFavorite,
  onToggleFavorite,
}: StudioCardProps) {
  return (
    <article className="group flex flex-col gap-3">
      <div className="relative aspect-10/9 overflow-hidden rounded-2xl">
        <Image
          src={studio.coverImage || studio.gallery?.[0] || "/placeholder.jpg"}
          alt={studio.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground backdrop-blur">
          {studio.badge}
        </span>

        <Link
          href={`/studio-details?id=${studio.id}`}
          aria-label={`View ${studio.name}`}
          className="absolute inset-0"
        />

        <Button
          type="button"
          aria-label={isFavorite ? "Remove from saved" : "Save studio"}
          onClick={() => onToggleFavorite(studio._id || studio.id || "")}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-foreground backdrop-blur transition-transform hover:scale-105"
        >
          <Heart
            className={cn("size-3.5 transition-colors", isFavorite && "fill-red-500 text-red-500")}
          />
        </Button>
      </div>

      {/* Name + rating */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate text-[15px] font-semibold tracking-tight">
          <Link
            href={`/studio-details?id=${studio.id}`}
            className="transition-opacity hover:opacity-70"
          >
            {studio.name}
          </Link>
        </h3>
        <span className="flex shrink-0 items-center gap-1.5">
          <Stars rating={studio.rating || 0} />
          <span className="text-xs text-muted-foreground">({studio.reviews})</span>
        </span>
      </div>

      {/* Location */}
      <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <MapPin className="size-3.5" />
        {studio.city}, {studio.country}
      </p>

      {/* Price + capacity */}
      <div className="flex items-end justify-between border-t border-border/50 pt-3">
        <p className="text-[15px] font-semibold tracking-tight">
          ${studio.hourlyRate || studio.price}
          <span className="text-xs font-normal text-muted-foreground"> /hour</span>
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5" />
          up to {(studio.maxCapacity || studio.capacity)}
        </p>
      </div>
    </article>
  );
}

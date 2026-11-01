import { Star } from "lucide-react";
import { cn } from "cn";

export function StarRating({
  rating,
  reviews,
  className,
}: {
  rating: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3",
              i < Math.round(rating)
                ? "fill-[#5a7a2e] text-[#5a7a2e]"
                : "fill-border text-border"
            )}
          />
        ))}
      </span>
      {reviews !== undefined ? (
        <span className="text-xs text-muted-foreground">({reviews})</span>
      ) : null}
    </span>
  );
}

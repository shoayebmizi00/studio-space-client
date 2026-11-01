import { MapPin, RotateCcw } from "lucide-react";
import {
  amenityOptions,
  capacityOptions,
  categoryOptions,
  ratingOptions,
} from "@/lib/studios-data";
import { cn } from "cn";

export type FilterState = {
  location: string;
  category: string;
  maxPrice: number;
  rating: number;
  capacity: number;
  amenities: string[];
};

export const defaultFilters: FilterState = {
  location: "",
  category: "All categories",
  maxPrice: 600,
  rating: 0,
  capacity: 0,
  amenities: [],
};

const labelClass =
  "mb-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground";

export function FiltersPanel({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const { setAmenity, clearAll } = helpers(onChange, filters);

  return (
    <aside className="flex flex-col gap-7 rounded-2xl border border-border/70 bg-card p-5">
      {/* Head */}
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight">Filters</h2>
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3" />
          Clear all
        </button>
      </div>

      {/* Location */}
      <div>
        <p className={labelClass}>Location</p>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            placeholder="City or country"
            className="h-10 w-full rounded-xl border border-border/70 bg-background pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <p className={labelClass}>Category</p>
        <div className="flex flex-col items-start gap-0.5">
          {categoryOptions.map((option) => {
            const active = filters.category === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange({ ...filters, category: option })}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-primary font-medium text-primary-foreground"
                    : "text-foreground/75 hover:bg-muted hover:text-foreground"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max price */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Max hourly price
          </p>
          <p className="text-xs font-semibold">${filters.maxPrice}</p>
        </div>
        <input
          type="range"
          min={0}
          max={600}
          step={10}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          aria-label="Max hourly price"
          className="h-1 w-full cursor-pointer accent-[#cff54a]"
        />
      </div>

      {/* Rating */}
      <div>
        <p className={labelClass}>Rating</p>
        <div className="flex flex-wrap items-center gap-2">
          {ratingOptions.map((option) => {
            const active = filters.rating === option.value;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => onChange({ ...filters, rating: option.value })}
                className={cn(
                  "rounded-full px-4 py-2 text-xs transition-colors",
                  active
                    ? "bg-foreground font-medium text-primary"
                    : "border border-border/70 bg-card text-foreground/75 hover:border-foreground/25 hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Capacity */}
      <div>
        <p className={labelClass}>Capacity</p>
        <div className="flex flex-wrap items-center gap-2">
          {capacityOptions.map((option) => {
            const active = filters.capacity === option.value;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => onChange({ ...filters, capacity: option.value })}
                className={cn(
                  "rounded-full px-4 py-2 text-xs transition-colors",
                  active
                    ? "bg-foreground font-medium text-primary"
                    : "border border-border/70 bg-card text-foreground/75 hover:border-foreground/25 hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className={labelClass}>Amenities</p>
        <div className="flex flex-col gap-2.5">
          {amenityOptions.map((amenity) => {
            const checked = filters.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => setAmenity(amenity)}
                className="flex items-center gap-2.5 text-left text-[13px] text-foreground/80"
              >
                <span
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-full border transition-colors",
                    checked
                      ? "border-[#86a337] bg-primary"
                      : "border-[#cff54a]/70 hover:border-[#86a337]"
                  )}
                >
                  {checked ? <span className="size-1.5 rounded-full bg-foreground" /> : null}
                </span>
                {amenity}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function helpers(
  onChange: (next: FilterState) => void,
  filters: FilterState
) {
  return {
    setAmenity(amenity: string) {
      const next = filters.amenities.includes(amenity)
        ? filters.amenities.filter((a) => a !== amenity)
        : [...filters.amenities, amenity];
      onChange({ ...filters, amenities: next });
    },
    clearAll() {
      onChange(defaultFilters);
    },
  };
}

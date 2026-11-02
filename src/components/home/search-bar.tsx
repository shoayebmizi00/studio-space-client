"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  CalendarDays,
  Users,
  ChevronDown,
  Search,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryOptions } from "@/lib/add-studio-data";

const divider = "hidden h-7 w-px shrink-0 bg-border/70 lg:block";

const capacityOptions = [
  { label: "Any capacity", value: "0" },
  { label: "2+ guests", value: "2" },
  { label: "4+ guests", value: "4" },
  { label: "8+ guests", value: "8" },
  { label: "12+ guests", value: "12" },
  { label: "25+ guests", value: "25" },
];

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All categories");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState("0");

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("location", location.trim());
    }
    if (category && category !== "All categories") {
      params.set("category", category);
    }
    if (capacity && capacity !== "0") {
      params.set("capacity", capacity);
    }
    if (date) {
      params.set("date", date);
    }

    const query = params.toString();
    router.push(query ? `/studios?${query}` : "/studios");
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card/95 p-2 shadow-xl shadow-black/15 backdrop-blur-md">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-1.5"
      >
        {/* Location input */}
        <div className="relative flex flex-1 items-center">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, area, or studio name"
            aria-label="Location"
            className="h-11 w-full rounded-xl border-none bg-transparent pl-10 pr-9 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus:bg-muted/40"
          />
          {location ? (
            <button
              type="button"
              onClick={() => setLocation("")}
              aria-label="Clear location"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <span
              className="absolute right-3 top-1/2 size-2 -translate-y-1/2 rounded-full bg-emerald-500/70"
              title="Global availability"
            />
          )}
        </div>

        <span className={divider} />

        {/* Category selector */}
        <div className="relative flex-1">
          <div className="flex h-11 w-full items-center gap-2.5 rounded-xl px-3 text-[13px] text-foreground/90 transition-colors hover:bg-muted/40">
            <LayoutGrid className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Studio Category"
              className="w-full cursor-pointer appearance-none bg-transparent py-2.5 pr-6 text-[13px] font-medium text-foreground outline-none"
            >
              <option value="All categories" className="bg-popover text-popover-foreground">
                All categories
              </option>
              {categoryOptions.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-popover text-popover-foreground"
                >
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <span className={divider} />

        {/* Date picker */}
        <div className="relative flex-1">
          <div className="relative flex h-11 w-full items-center gap-2 rounded-xl px-3 transition-colors hover:bg-muted/40">
            <CalendarDays className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
            <Input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Booking date"
              className="h-9 w-full cursor-pointer border-none bg-transparent p-0 text-[13px] font-medium text-foreground outline-none focus-visible:ring-0"
            />
          </div>
        </div>

        <span className={divider} />

        {/* Capacity / Guests */}
        <div className="relative flex-1">
          <div className="flex h-11 w-full items-center gap-2.5 rounded-xl px-3 text-[13px] text-foreground/90 transition-colors hover:bg-muted/40">
            <Users className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              aria-label="Guests and Capacity"
              className="w-full cursor-pointer appearance-none bg-transparent py-2.5 pr-6 text-[13px] font-medium text-foreground outline-none"
            >
              {capacityOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-popover text-popover-foreground"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Submit Search Button */}
        <Button
          type="submit"
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[13px] font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-95 active:scale-[0.98] lg:shrink-0"
        >
          <Search className="size-4" />
          Search
        </Button>
      </form>
    </div>
  );
}

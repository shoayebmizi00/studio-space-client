"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

export const sortOptions = [
  "Recommended",
  "Newest",
  "Price: low to high",
  "Price: high to low",
  "Top rated",
] as const;

export type SortOption = (typeof sortOptions)[number];

export function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        className="flex h-11 items-center gap-2 rounded-xl border border-border/70 bg-card px-4 text-[13px] font-medium transition-colors hover:border-foreground/25"
      >
        {value}
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </Button>

      {open ? (
        <>
          {/* Click-away layer */}
          <div
            aria-hidden
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            aria-label="Sort by"
            className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-full w-max flex-col overflow-hidden rounded-xl border border-border/60 bg-card p-1.5 text-left shadow-lg shadow-black/5"
          >
            {sortOptions.map((option) => {
              const active = option === value;
              return (
                <li key={option}>
                  <Button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-6 rounded-lg px-2.5 py-2 text-[13px] transition-colors hover:bg-muted"
                  >
                    {option}
                    <Check
                      className={cn(
                        "size-3.5 shrink-0",
                        active ? "text-foreground" : "opacity-0"
                      )}
                    />
                  </Button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </div>
  );
}

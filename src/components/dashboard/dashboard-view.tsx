"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Heart,
  LayoutGrid,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useSavedStudios } from "@/lib/saved-studios";

type Stat = {
  label: string;
  value: string;
  href: string;
  icon: typeof LayoutGrid;
};

export function DashboardView() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const { count: savedCount } = useSavedStudios();

  const [listingCount, setListingCount] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const ownerEmail = user?.email;

  // Load my listings and bookings for the overview numbers.
  useEffect(() => {
    if (!ownerEmail) return;
    let active = true;

    async function load(email: string) {
      try {
        const [listingsRes, bookingsRes] = await Promise.all([
          fetch(`/api/studios?ownerEmail=${encodeURIComponent(email)}`, {
            cache: "no-store",
          }),
          fetch("/api/bookings", { cache: "no-store" }),
        ]);
        const listings = listingsRes.ok ? await listingsRes.json() : [];
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
        if (active) {
          setListingCount(Array.isArray(listings) ? listings.length : 0);
          setBookingCount(Array.isArray(bookings) ? bookings.length : 0);
        }
      } catch {
        if (active) {
          setListingCount(0);
          setBookingCount(0);
        }
      }
    }

    load(ownerEmail);
    return () => {
      active = false;
    };
  }, [ownerEmail]);

  const stats: Stat[] = [
    {
      label: "My listings",
      value: listingCount === null ? "…" : String(listingCount),
      href: "/my-listings",
      icon: LayoutGrid,
    },
    {
      label: "My bookings",
      value: bookingCount === null ? "…" : String(bookingCount),
      href: "/my-bookings",
      icon: CalendarDays,
    },
    {
      label: "Saved studios",
      value: String(savedCount),
      href: "/saved-studios",
      icon: Heart,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {isPending ? "Loading…" : `Welcome back, ${(user?.name ?? "creator").split(" ")[0]}`}
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Everything you host and book on StudioSpace, in one place.
          </p>
        </div>
        <Link
          href="/add-studio"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98]"
        >
          <Plus className="size-4" />
          Add new studio
        </Link>
      </div>

      {/* Overview numbers */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-foreground/25"
          >
            <div>
              <p className="text-[13px] text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{stat.value}</p>
            </div>
            <span className="grid size-10 place-items-center rounded-full bg-muted text-foreground/70 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <stat.icon className="size-4" />
            </span>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/my-listings"
          className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-foreground/25"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
            <LayoutGrid className="size-4 text-foreground/70" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Manage your listings</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Update pricing, photos and rules — or remove a space you no longer rent out.
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-foreground">
              Open my listings <ArrowRight className="size-3.5" />
            </span>
          </div>
        </Link>

        <Link
          href="/my-bookings"
          className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-foreground/25"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
            <CalendarDays className="size-4 text-foreground/70" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Track your bookings</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              See pending requests, confirmed sessions and download invoices for completed shoots.
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-foreground">
              Open my bookings <ArrowRight className="size-3.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Host a studio banner */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-muted/60 p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-background">
            <Plus className="size-5 text-foreground/70" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Have a space to share?</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Publish a listing and earn from the hours your studio sits empty.
            </p>
          </div>
        </div>
        <Link
          href="/add-studio"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98]"
        >
          Start listing
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </main>
  );
}

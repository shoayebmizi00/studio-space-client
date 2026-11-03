"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/* One studio owned by the signed-in host                              */
/* ------------------------------------------------------------------ */

type MyListing = {
  _id: string;
  name: string;
  category: string;
  city: string;
  country: string;
  hourlyRate: number;
  maxCapacity: number;
  coverImage: string | null;
  status: string;
  createdAt: string;
};

export function MyListingsView() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<MyListing | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const ownerEmail = user?.email;

  // Load my listings from our own API route (owner email must match).
  useEffect(() => {
    if (!ownerEmail) return;
    let active = true;

    async function load(email: string) {
      try {
        const res = await fetch(
          `/api/studios?ownerEmail=${encodeURIComponent(email)}`,
          { cache: "no-store" }
        );
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || `Server returned ${res.status}`);
        }
        if (active) setListings(data);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load your listings.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load(ownerEmail);
    return () => {
      active = false;
    };
  }, [ownerEmail]);

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      // Delete the listing for good.
      const res = await fetch(`/api/studios/${deleting._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Could not delete this listing.");
      }

      setListings((current) => current.filter((item) => item._id !== deleting._id));
      toast.success("Listing deleted", {
        description: `${deleting.name} is no longer visible in the marketplace.`,
      });
      setDeleting(null);
    } catch (deleteError) {
      toast.error("Could not delete listing", {
        description: deleteError instanceof Error ? deleteError.message : "Please try again.",
      });
    } finally {
      setDeletingBusy(false);
    }
  };

  if (isPending || (!user && !isPending && loading)) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="text-3xl font-semibold tracking-tight">My studio listings</h1>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="animate-pulse rounded-2xl border border-border/60 bg-card p-4">
              <div className="h-40 rounded-xl bg-muted" />
              <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My studio listings</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Every space you host, in one place. Update the details or remove a listing.
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

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="animate-pulse rounded-2xl border border-border/60 bg-card p-4">
              <div className="h-40 rounded-xl bg-muted" />
              <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 h-10 rounded-full border border-border bg-card px-5 text-[13px] font-medium"
          >
            Try again
          </Button>
        </div>
      ) : listings.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/70 bg-card/60 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted">
            <Plus className="size-5 text-muted-foreground" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">You have not listed a studio yet</h2>
            <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
              Publish your first space and start earning from the hours your studio sits empty.
            </p>
          </div>
          <Link
            href="/add-studio"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98]"
          >
            <Plus className="size-4" />
            Add your first studio
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <article
              key={listing._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <div className="relative h-44 overflow-hidden bg-muted">
                {listing.coverImage ? (
                  <Image
                    src={listing.coverImage}
                    alt={listing.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid size-full place-items-center text-muted-foreground">
                    <CalendarDays className="size-6" />
                  </span>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground backdrop-blur">
                  {listing.category || "Studio"}
                </span>
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                    listing.status === "published"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {listing.status === "published" ? "Live" : listing.status}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h2 className="text-[15px] font-semibold leading-snug tracking-tight">
                    {listing.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {[listing.city, listing.country].filter(Boolean).join(", ") || "Location not set"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">${listing.hourlyRate}/hr</span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    {listing.maxCapacity} people
                  </span>
                </div>

                <div className="mt-auto flex gap-2 pt-1">
                  <Link
                    href={`/studios/edit/${listing._id}`}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-border/70 bg-card text-[13px] font-medium transition-colors hover:border-foreground/30"
                  >
                    <Pencil className="size-3.5" />
                    Update
                  </Link>
                  <Button
                    type="button"
                    onClick={() => setDeleting(listing)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-red-200 bg-card text-[13px] font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this listing?</DialogTitle>
            <DialogDescription>
              {deleting
                ? `${deleting.name} will be permanently removed from the marketplace. This cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              onClick={() => setDeleting(null)}
              disabled={deletingBusy}
              className="h-10 rounded-full border border-border bg-card px-5 text-[13px] font-medium"
            >
              Keep it
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={deletingBusy}
              className="h-10 rounded-full bg-red-600 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {deletingBusy ? "Deleting…" : "Delete listing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

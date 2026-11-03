"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  Heart,
  Lock,
  MapPin,
  Pencil,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Stars } from "@/components/studios/studio-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";
import type { Studio } from "@/lib/studio-type";
import { useSavedStudios } from "@/lib/saved-studios";
import { toast } from "sonner";

const statCardClass = "rounded-xl border border-border/60 bg-card p-4";

/* ------------------------------------------------------------------ */
/* Booking widget                                                      */
/* ------------------------------------------------------------------ */

function hoursBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const from = new Date(`2000-01-01T${start}`);
  const to = new Date(`2000-01-01T${end}`);
  const diff = (to.getTime() - from.getTime()) / 3_600_000;
  return Number.isFinite(diff) && diff > 0 ? diff : 0;
}

function BookingWidget({ studio, deposit }: { studio: Studio; deposit: number }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const hours = hoursBetween(start, end);
  const price = studio.hourlyRate || studio.price || 0;
  const capacity = studio.maxCapacity || studio.capacity || 0;
  const subtotal = price * hours;
  const total = subtotal + deposit;

  const submitBooking = async () => {
    setSubmitting(true);
    setRequestError(null);
    try {
      // Send the booking request to our own API route.
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime: start,
          endTime: end,
          projectDetails: details,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Could not request this booking.");
      }

      setRequestSent(true);
      toast.success("Booking request sent", {
        description: "You can track the host's response in My bookings.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not request this booking.";
      setRequestError(message);
      toast.error("Booking request failed", { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="rounded-2xl border border-border/60 bg-card p-6 lg:sticky lg:top-8">
      <div className="flex items-start justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight">
          ${price}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            per hour · ${deposit} deposit
          </span>
        </p>
        <span className="mt-1 shrink-0 rounded-full bg-muted px-3 py-1 text-[11px] font-medium">
          {capacity} people
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="booking-date" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Date
          </Label>
          <div className="relative">
            <Input
              id="booking-date"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-12 w-full rounded-xl border border-border/70 bg-background px-10 text-[13px] outline-none transition-colors focus:border-foreground/25"
            />
            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="booking-start" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Start
            </Label>
            <div className="relative">
              <Input
                id="booking-start"
                type="time"
                value={start}
                onChange={(event) => setStart(event.target.value)}
                className="h-12 w-full rounded-xl border border-border/70 bg-background px-10 text-[13px] outline-none transition-colors focus:border-foreground/25"
              />
              <Clock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div>
            <Label htmlFor="booking-end" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              End
            </Label>
            <div className="relative">
              <Input
                id="booking-end"
                type="time"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className="h-12 w-full rounded-xl border border-border/70 bg-background px-10 text-[13px] outline-none transition-colors focus:border-foreground/25"
              />
              <Clock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="booking-notes" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Project details (optional)
          </Label>
          <Textarea
            id="booking-notes"
            rows={3}
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Crew size, equipment, anything the host should know"
            className="w-full resize-none rounded-xl border border-border/70 bg-background px-3.5 py-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25"
          />
        </div>
      </div>

      {/* Price breakdown */}
      <div className="mt-5 flex flex-col gap-2.5 border-t border-border/60 pt-4 text-[13px]">
        <p className="flex items-center justify-between text-muted-foreground">
          <span>
            ${price} × {hours} hr
          </span>
          <span className="text-foreground">${subtotal}</span>
        </p>
        <p className="flex items-center justify-between text-muted-foreground">
          <span>Security deposit</span>
          <span className="text-foreground">${deposit}</span>
        </p>
        <p className="flex items-center justify-between border-t border-border/60 pt-3 font-semibold tracking-tight">
          <span>Total</span>
          <span>${total}</span>
        </p>
      </div>

      <Button
        type="button"
        disabled={submitting || requestSent || !date || !start || !end || hours <= 0}
        onClick={submitBooking}
        className="mt-4 h-11 w-full rounded-xl bg-primary text-[13px] font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending request…" : requestSent ? "Request sent" : "Request this workspace"}
      </Button>

      {requestError ? (
        <p className="mt-3 text-xs leading-relaxed text-red-600">
          {requestError}{" "}
          {requestError.toLowerCase().includes("sign in") ? (
            <Link href="/sign-in" className="font-semibold underline underline-offset-2">Sign in</Link>
          ) : null}
        </p>
      ) : null}
      {requestSent ? (
        <Link href="/my-bookings" className="mt-3 inline-block text-xs font-medium underline underline-offset-2">
          View my bookings
        </Link>
      ) : null}

      <div className="mt-4 flex flex-col gap-2.5 border-t border-border/60 pt-4">
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
          <Lock className="mt-0.5 size-3 shrink-0" />
          This request is pending until the host confirms it. No payment is taken here.
        </p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* View                                                                */
/* ------------------------------------------------------------------ */

export function StudioDetailsView({ studio }: { studio: Studio | null }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const studioId = studio?._id || studio?.id || "";
  const { has, toggle } = useSavedStudios();
  const isSaved = has(studioId);

  const handleToggleSaved = () => {
    if (!studio) return;
    const nowSaved = toggle(studioId);
    if (nowSaved) {
      toast.success("Studio saved", {
        description: `${studio.name} added to your saved collection.`,
      });
    } else {
      toast.info("Removed from saved", {
        description: `${studio.name} removed from your saved collection.`,
      });
    }
  };

  if (!studio) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-surface-alt px-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Studio not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This studio may have been removed or the ID is invalid.
        </p>
        <Link
          href="/studios"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98]"
        >
          Explore all studios
        </Link>
      </div>
    );
  }

  // Show the studio data in the layout this page expects.
  const detail = {
    about: [studio.fullDescription || studio.shortDescription].filter(Boolean),
    gallery: [studio.coverImage, ...(studio.gallery || [])].filter(
      (image): image is string => Boolean(image)
    ),
    amenities: studio.amenities || [],
    equipment: studio.equipment || [],
    city: studio.city || "",
    street: studio.streetAddress || "",
    deposit: studio.securityDeposit || 0,
    rules: studio.rules,
    cancellation: studio.cancellationPolicy,
  };

  const stats = [
    { icon: Users, label: "Capacity", value: `${studio.maxCapacity || studio.capacity} people` },
    { icon: Pencil, label: "Space type", value: studio.category || "" },
    { icon: Sparkles, label: "From", value: `${studio.hourlyRate || studio.price}/hour` },
    { icon: ShieldCheck, label: "Deposit", value: `Refundable $${studio.securityDeposit || 0}` },
  ];

  return (
    <div className="bg-surface-alt">
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/studios" className="transition-colors hover:text-foreground">
            Studios
          </Link>
          <span>›</span>
          <span>{studio.category}</span>
          <span>›</span>
          <span className="font-medium text-foreground">{studio.name}</span>
        </nav>

        {/* Header */}
        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-border/70 bg-card px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/70">
                {studio.category}
              </span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">{studio.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {[studio.city, studio.country].filter(Boolean).join(", ")}
              </span>
              <span className="flex items-center gap-1.5">
                <Stars rating={studio.rating || 0} />
                <span className="font-semibold text-foreground">
                  {(studio.rating || 0).toFixed(1)}
                </span>
                <span>({studio.reviews})</span>
              </span>
            </p>
          </div>

          <Button
            type="button"
            onClick={handleToggleSaved}
            className="flex h-10 items-center gap-2 rounded-full border border-border/70 bg-card px-4 text-[13px] font-medium transition-colors hover:border-foreground/25"
          >
            <Heart
              className={cn(
                "size-3.5 transition-colors",
                isSaved && "fill-red-500 text-red-500"
              )}
            />
            {isSaved ? "Saved" : "Save studio"}
          </Button>
        </div>

        {/* Gallery */}
        <div className="mt-6 grid grid-cols-[3fr_1.2fr] items-stretch gap-3 max-md:grid-cols-1">
          <div className="relative aspect-21/9 max-md:aspect-16/10 overflow-hidden rounded-2xl bg-muted">
            {/* Only show the photo when the studio actually has one. */}
            {detail.gallery.length > 0 ? (
              <>
                <Image
                  src={detail.gallery[activePhoto]}
                  alt={studio.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                />
                <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="size-3">
                    <rect x="1" y="4" width="3" height="8" rx="0.5" />
                    <rect x="6.5" y="4" width="3" height="8" rx="0.5" />
                    <rect x="12" y="4" width="3" height="8" rx="0.5" />
                  </svg>
                  {detail.gallery.length} photos
                </span>
              </>
            ) : null}
          </div>
          <div className="grid grid-rows-2 gap-3 max-md:grid-rows-2 max-md:hidden">
            {detail.gallery.map((photo: string, index: number) => (
              <Button
                key={index}
                type="button"
                aria-label={`Show photo ${index + 1}`}
                onClick={() => setActivePhoto(index)}
                className={cn(
                  "relative overflow-hidden rounded-2xl transition-opacity",
                  index === activePhoto ? "opacity-100" : "opacity-80 hover:opacity-100"
                )}
              >
                <Image
                  src={photo}
                  alt={`${studio.name} photo ${index + 1}`}
                  fill
                  unoptimized
                  sizes="20vw"
                  className="object-cover"
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Content + booking sidebar */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-10">
            {/* About */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">About this space</h2>
              {detail.about.map((paragraph: string, index: number) => (
                <p key={index} className="mt-4 text-[13px] leading-relaxed text-foreground/85">
                  {paragraph}
                </p>
              ))}
              <div className="mt-6 grid grid-cols-2 gap-3 max-sm:grid-cols-1 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className={statCardClass}>
                    <stat.icon className="size-4 text-foreground/70" />
                    <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-[13px] font-semibold tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Amenities</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {detail.amenities.map((amenity: string) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-[13px]"
                  >
                    <CircleCheck className="size-3.5 text-foreground/70" />
                    {amenity}
                  </span>
                ))}
              </div>
            </section>

            {/* Equipment */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                <Wrench className="size-4 text-foreground/70" />
                Equipment included
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {detail.equipment.map((item: string) => (
                  <span
                    key={item}
                    className="rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>

            {/* Rules + policy */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <h3 className="text-sm font-semibold tracking-tight">Studio rules</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  {detail.rules}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <h3 className="text-sm font-semibold tracking-tight">Cancellation policy</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  {detail.cancellation}
                </p>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Location</h2>
              <div className="mt-4 rounded-2xl border border-border/60 bg-card p-5">
                <p className="flex items-center gap-2 text-[13px] font-semibold tracking-tight">
                  <MapPin className="size-3.5 text-foreground/60" />
                  {detail.city}
                </p>
                <p className="mt-1.5 text-[13px] text-muted-foreground">{detail.street}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${detail.street}, ${detail.city}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-[13px] font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Open in Google Maps
                </a>
              </div>
            </section>

            {studio.reviews ? (
              <section>
                <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-6">
                  <Stars rating={studio.rating || 0} />
                  <span className="text-sm font-semibold">
                    {(studio.rating || 0).toFixed(1)} · {studio.reviews} reviews
                  </span>
                </div>
              </section>
            ) : null}
          </div>

          {/* Sticky booking panel */}
          <BookingWidget studio={studio} deposit={detail.deposit} />
        </div>
      </main>
    </div>
  );
}

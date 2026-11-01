"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  Heart,
  Info,
  Lock,
  MapPin,
  Pencil,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Stars } from "@/components/studios/studio-card";
import { getStudioDetail } from "@/lib/studio-details-data";
import type { Studio } from "@/lib/studios-data";
import { cn } from "cn";

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
  const [requested, setRequested] = useState(false);

  const hours = hoursBetween(start, end);
  const subtotal = studio.price * hours;
  const total = subtotal + deposit;

  return (
    <aside className="rounded-2xl border border-border/60 bg-card p-6 lg:sticky lg:top-8">
      <div className="flex items-start justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight">
          ${studio.price}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            per hour · ${deposit} deposit
          </span>
        </p>
        <span className="mt-1 shrink-0 rounded-full bg-muted px-3 py-1 text-[11px] font-medium">
          {studio.capacity} people
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="booking-date" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Date
          </label>
          <div className="relative">
            <input
              id="booking-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-12 w-full rounded-xl border border-border/70 bg-background px-10 text-[13px] outline-none transition-colors focus:border-foreground/25"
            />
            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="booking-start" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Start
            </label>
            <div className="relative">
              <input
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
            <label htmlFor="booking-end" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              End
            </label>
            <div className="relative">
              <input
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
          <label htmlFor="booking-notes" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Project details (optional)
          </label>
          <textarea
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
            ${studio.price} × {hours} hr
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

      <button
        type="button"
        disabled={requested}
        onClick={() => setRequested(true)}
        className={cn(
          "mt-4 h-11 w-full rounded-xl text-[13px] font-semibold transition-all",
          requested
            ? "border border-border/70 bg-card text-foreground/80"
            : "bg-primary text-primary-foreground hover:brightness-95 active:scale-[0.98]"
        )}
      >
        {requested ? "Request sent — the host will confirm" : "Request this workspace"}
      </button>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-border/60 pt-4">
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
          <Lock className="mt-0.5 size-3 shrink-0" />
          Availability is validated on our server before a request is created. The
          host confirms before anything is charged.
        </p>
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3 shrink-0" />
          Development payment simulation — no card is charged while the gateway is
          being connected.
        </p>
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3 shrink-0" />
          Flexible — free cancellation up to 24 hours before the session. Inside 24
          hours the deposit is retained.
        </p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* View                                                                */
/* ------------------------------------------------------------------ */

export function StudioDetailsView({ studio }: { studio: Studio }) {
  const detail = getStudioDetail(studio);
  const [activePhoto, setActivePhoto] = useState(0);
  const [saved, setSaved] = useState(false);

  const stats = [
    { icon: Users, label: "Capacity", value: `${studio.capacity} people` },
    { icon: Pencil, label: "Space type", value: detail.spaceType },
    { icon: Sparkles, label: "From", value: detail.rateBasis },
    { icon: ShieldCheck, label: "Deposit", value: "Refundable" },
  ];

  const maxDist = Math.max(1, ...detail.distribution);

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
                {studio.badge}
              </span>
              {detail.verified ? (
                <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground">
                  <CircleCheck className="size-3" />
                  Verified listing
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">{studio.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {studio.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Stars rating={studio.rating} />
                <span className="font-semibold text-foreground">
                  {studio.rating.toFixed(1)}
                </span>
                <span>({studio.reviews})</span>
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSaved((prev) => !prev)}
            className="flex h-10 items-center gap-2 rounded-full border border-border/70 bg-card px-4 text-[13px] font-medium transition-colors hover:border-foreground/25"
          >
            <Heart
              className={cn(
                "size-3.5",
                saved && "fill-red-500 text-red-500"
              )}
            />
            {saved ? "Saved" : "Save studio"}
          </button>
        </div>

        {/* Gallery */}
        <div className="mt-6 grid grid-cols-[3fr_1.2fr] items-stretch gap-3 max-md:grid-cols-1">
          <div className="relative aspect-[21/9] max-md:aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src={detail.gallery[activePhoto]}
              alt={studio.name}
              fill
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
          </div>
          <div className="grid grid-rows-2 gap-3 max-md:grid-rows-2 max-md:hidden">
            {detail.gallery.map((photo, index) => (
              <button
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
                  sizes="20vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content + booking sidebar */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-10">
            {/* About */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">About this space</h2>
              {detail.about.map((paragraph, index) => (
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
                {detail.amenities.map((amenity) => (
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
                {detail.equipment.map((item) => (
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

            {/* Host */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                Hosted by {detail.host.name}
              </h2>
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold">
                  {detail.host.initials}
                </span>
                <div>
                  <p className="text-[13px] font-semibold tracking-tight">{detail.host.name}</p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{detail.host.since}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CircleCheck className="size-3.5" />
                    {detail.host.note}
                  </p>
                </div>
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
                <p className="mt-3 text-xs text-muted-foreground">{detail.accessNote}</p>
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

            {/* Reviews */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
              <div className="mt-4 rounded-2xl border border-border/60 bg-card p-6">
                <div className="flex items-center gap-8 max-sm:flex-col max-sm:items-start">
                  <div className="flex flex-col items-start gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight">
                      {studio.rating.toFixed(1)}
                    </span>
                    <Stars rating={studio.rating} />
                    <span className="text-xs text-muted-foreground">
                      {studio.reviews} reviews
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    {detail.distribution
                      .map((count, index) => ({ stars: 5 - index, count }))
                      .map((row) => (
                        <div key={row.stars} className="flex items-center gap-3">
                          <span className="w-6 shrink-0 text-xs text-muted-foreground">
                            {row.stars}★
                          </span>
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <span
                              className="block h-full rounded-full bg-foreground transition-all"
                              style={{ width: `${(row.count / maxDist) * 100}%` }}
                            />
                          </span>
                          <span className="w-4 shrink-0 text-right text-xs text-muted-foreground">
                            {row.count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-5">
                {detail.reviews.map((review) => (
                  <article key={review.name} className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold">
                      {review.initials}
                    </span>
                    <div className="min-w-0 flex-1 border-b border-border/50 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold tracking-tight">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="mt-1">
                        <Stars rating={review.rating} />
                      </div>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-foreground/85">
                        {review.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky booking panel */}
          <BookingWidget studio={studio} deposit={detail.deposit} />
        </div>
      </main>
    </div>
  );
}

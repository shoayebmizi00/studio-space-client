"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Check } from "lucide-react";
import Link from "next/link";

const eyebrow = "mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground";

const contactRows = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@studiospace.example",
  },
  {
    icon: Phone,
    label: "Support hours",
    value: "Mon–Fri, 9:00–18:00",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Remote-first, working wherever creators are",
  },
];

const topics = ["Bookings", "Listings", "Payouts & payments", "Something else"];

const fieldLabel = "mb-2 block text-[13px] font-semibold tracking-tight";
const fieldClass =
  "w-full rounded-xl border border-border/70 bg-card px-3.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/25";

export function ContactView() {
  const [sent, setSent] = useState(false);

  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-24">
      {/* Left: intro */}
      <div>
        <p className={eyebrow}>Contact</p>
        <h1 className="max-w-md text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-[42px]">
          Talk to a human about your space or your booking.
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Questions about a reservation, a listing, or how payouts work? Send a
          note and the team will get back to you within one business day.
        </p>

        <div className="mt-9 flex flex-col gap-5">
          {contactRows.map((row) => (
            <div key={row.label} className="flex items-center gap-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/70 bg-card text-foreground/70">
                <row.icon className="size-4" />
              </span>
              <p className="flex flex-col gap-0.5">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {row.label}
                </span>
                <span className="text-[13px] text-foreground/85">{row.value}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-9 max-w-xl rounded-2xl border border-border/70 bg-card p-5">
          <p className="flex items-center gap-2.5 text-[13px] font-semibold tracking-tight">
            <MessageSquare className="size-4 text-foreground/70" />
            Before you write
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
            Booking changes are fastest through the booking itself — open it
            from{" "}
            <Link
              href="/my-bookings"
              className="text-foreground/80 underline underline-offset-3 transition-opacity hover:opacity-70"
            >
              My bookings
            </Link>{" "}
            to cancel or review its status.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="h-fit rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={fieldLabel}>
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Alex Rivera"
                className={`${fieldClass} h-11`}
              />
            </div>
            <div>
              <label htmlFor="email" className={fieldLabel}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@studio.com"
                className={`${fieldClass} h-11`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="topic" className={fieldLabel}>
              Topic
            </label>
            <div className="relative">
              <select id="topic" name="topic" defaultValue={topics[0]} className={`${fieldClass} h-11 appearance-none pr-9`}>
                {topics.map((topic) => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="message" className={fieldLabel}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="Include a booking reference if your question is about a reservation."
              className={`${fieldClass} resize-y px-3.5 py-3`}
            />
          </div>

          <button
            type="submit"
            disabled={sent}
            className="h-12 rounded-xl bg-primary text-[14px] font-semibold text-primary-foreground transition-all hover:brightness-95 active:scale-[0.99] disabled:opacity-80"
          >
            {sent ? "Message sent" : "Send message"}
          </button>

          {sent ? (
            <p className="flex items-center justify-center gap-2 text-[13px] text-foreground/80">
              <Check className="size-3.5 text-[#5a7a2e]" />
              Thanks — the team will get back to you within one business day.
            </p>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              We only use your details to answer this message.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

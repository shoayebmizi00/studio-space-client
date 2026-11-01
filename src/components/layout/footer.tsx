"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

const socials = [
  {
    label: "Instagram",
    path: "M12 2.2c-2.7 0-3 0-4.1.1-1 0-1.7.2-2.3.4-.6.3-1.1.6-1.6 1.1-.5.5-.8 1-1.1 1.6-.2.6-.4 1.3-.4 2.3-.1 1-.1 1.4-.1 4.1s0 3 .1 4.1c0 1 .2 1.7.4 2.3.3.6.6 1.1 1.1 1.6.5.5 1 .8 1.6 1.1.6.2 1.3.4 2.3.4 1 .1 1.4.1 4.1.1s3 0 4.1-.1c1 0 1.7-.2 2.3-.4.6-.3 1.1-.6 1.6-1.1.5-.5.8-1 1.1-1.6.2-.6.4-1.3.4-2.3.1-1 .1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.7-.4-2.3-.3-.6-.6-1.1-1.1-1.6-.5-.5-1-.8-1.6-1.1-.6-.2-1.3-.4-2.3-.4-1-.1-1.4-.1-4.1-.1zM12 22c-2.7 0-3 0-4-.1-1 0-1.6-.2-2-.3-.5-.2-.8-.4-1.2-.8-.4-.4-.6-.7-.8-1.2-.1-.4-.3-1-.3-2C7.6 15 7.6 14.7 7.6 12s0-3 .1-4c0-1 .2-1.6.3-2 .2-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.4-.1 1-.3 2-.3 1-.1 1.3-.1 4-.1s3 0 4 .1c1 0 1.6.2 2 .3.5.2.8.4 1.2.8.4.4.6.7.8 1.2.1.4.3 1 .3 2 .1 1 .1 1.3.1 4s0 3-.1 4c0 1-.2 1.6-.3 2-.2.5-.4.8-.8 1.2-.4.4-.7.6-1.2.8-.4.1-1 .3-2 .3-1 .1-1.3.1-4 .1zm0-15.3a5.3 5.3 0 100 10.6 5.3 5.3 0 000-10.6zm0 8.7a3.4 3.4 0 110-6.8 3.4 3.4 0 010 6.8zm6.8-9a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z",
  },
  {
    label: "X",
    path: "M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 5.9-7zm-1.3 19.5h2L6.5 3.2H4.3l13.3 17.5z",
  },
  {
    label: "LinkedIn",
    path: "M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3-1.9 0-2.2 1.4-2.2 2.9v5.7H9.1V9h3.4v1.6h.1c.5-.9 1.7-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3zM5.3 7.4a2.1 2.1 0 110-4.2 2.1 2.1 0 010 4.2zM7.1 20.5H3.5V9h3.6v11.5z",
  },
];

/* ------------------------------------------------------------------ */
/* Variant data                                                        */
/* ------------------------------------------------------------------ */

const landingColumns = [
  {
    heading: "Discover",
    links: [
      { label: "Explore studios", href: "/studios" },
      { label: "How it works", href: "/how-it-works" },
      { label: "For hosts", href: "/about" },
      { label: "FAQ", href: "/contact" },
    ],
  },
  {
    heading: "Hosting",
    links: [
      { label: "List your studio", href: "/add-studio" },
      { label: "Host resources", href: "/about" },
      { label: "Pricing", href: "/studios" },
      { label: "Availability", href: "/dashboard" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My bookings", href: "/my-bookings" },
      { label: "Saved studios", href: "/saved-studios" },
      { label: "Profile", href: "/profile" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const landingTags = [
  "Photography Studio",
  "Film & Camera Hire",
  "Podcast Recording Room",
  "Audio Tracking Studio",
  "Voiceover Booth",
  "Sound Stage",
  "Event & Production Space",
];

const landingLegal = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

const appColumns = [
  {
    heading: "Discover",
    links: [
      { label: "Explore studios", href: "/studios" },
      { label: "How it works", href: "/how-it-works" },
      { label: "About us", href: "/about" },
      { label: "FAQ", href: "/contact" },
    ],
  },
  {
    heading: "Hosting",
    links: [
      { label: "List your studio", href: "/add-studio" },
      { label: "My listings", href: "/dashboard" },
      { label: "Host dashboard", href: "/dashboard" },
      { label: "Availability", href: "/dashboard" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My bookings", href: "/my-bookings" },
      { label: "Saved studios", href: "/saved-studios" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const appTags = [
  "Photography Studio",
  "Film & Cinema Stage",
  "Podcast Recording Room",
  "Music Recording Suite",
  "Art Workshop",
  "Content Creation Studio",
  "Rehearsal Space",
  "Event & Production Space",
];

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

/**
 * Shared site footer, rendered once in `src/app/layout.tsx`.
 * The landing page keeps its pill-tag style with the legal bar;
 * studio pages keep the plain keyword row with the booking note.
 */
export function Footer() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  // Full-screen auth pages render their own footer text — no shared chrome.
  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  const columns = isLanding ? landingColumns : appColumns;
  const tags = isLanding ? landingTags : appTags;

  return (
    <footer className={isLanding ? "bg-background" : "bg-surface-alt"}>
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <div
          className={
            isLanding
              ? "grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]"
              : "grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] md:pl-[20%]"
          }
        >
          {/* Brand */}
          <div className="flex flex-col items-start gap-5">
            <Logo />
            <p className="max-w-[15rem] text-xs leading-relaxed text-muted-foreground">
              The marketplace for creative space. Create. Collaborate. Produce.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="grid size-8 place-items-center rounded-full border border-border bg-card text-foreground/70 transition-colors hover:border-foreground/25 hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <nav key={column.heading} className="flex flex-col gap-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {column.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-foreground/80 transition-opacity hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Keywords */}
        {isLanding ? (
          <div className="mt-12 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/70 px-3 py-1.5 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
            {tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom bar */}
        {isLanding ? (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6">
            <p className="text-xs text-muted-foreground">
              © 2025 StudioSpace. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              {landingLegal.map((item) => (
                <Link
                  key={item}
                  href="/contact"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 StudioSpace. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Bookings are requests until a host confirms availability.
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}

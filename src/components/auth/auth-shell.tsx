import Image from "next/image";
import type { ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import img8 from "@/assests/8.png";

/* ------------------------------------------------------------------ */
/* Shared split-screen auth backdrop                                   */
/* ------------------------------------------------------------------ */

const perks = [
  "Book by the hour — no membership, no minimums",
  "Live availability straight from verified hosts",
  "Save spaces, manage bookings and reviews in one place",
];

const marketplacePill = "Hourly studio marketplace";

const panelCopy = {
  heading: "Spaces worth showing up for.",
  body: "StudioSpace connects creators with professional studios, stages and recording rooms — bookable by the hour, from the people who own them.",
  copyright: "© 2026 StudioSpace. Built for creators and hosts.",
};

/**
 * The photo panel shared by the auth pages. Wrap any form content in it —
 * it renders the cream right-hand column around the children.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Photo panel */}
      <section className="relative hidden overflow-hidden lg:block">
        <Image
          src={img8}
          alt="Professional photo studio"
          fill
          priority
          sizes="50vw"
          className="object-cover brightness-[0.42]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/70" />

        <div className="relative flex h-full flex-col p-10 sm:p-12">
          <Logo dark className="text-white" />

          <div className="mt-auto flex flex-col items-start">
            <span className="flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 text-[11px] text-white/85">
              <span className="size-1.5 rounded-full bg-primary" />
              {marketplacePill}
            </span>
            <h1 className="mt-5 max-w-md text-5xl font-semibold tracking-tight text-white">
              {panelCopy.heading}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              {panelCopy.body}
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-[13px] text-white/90">
                  <CircleCheck className="size-4 shrink-0 fill-primary text-foreground" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-14 text-xs text-white/50">{panelCopy.copyright}</p>
        </div>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center bg-surface-alt px-4 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">{children}</div>
      </section>
    </main>
  );
}

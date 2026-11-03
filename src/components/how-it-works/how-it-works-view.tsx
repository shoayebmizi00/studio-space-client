import Image from "next/image";
import Link from "next/link";
import {
  Search,
  CalendarDays,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Undo2,
  CalendarCheck2,
  ArrowRight,
} from "lucide-react";
import { images } from "@/lib/home-data";import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

type InfoCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const creatorCards: InfoCard[] = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Search by city, category, price, capacity and amenities. Availability filters only show spaces that are genuinely open on your date.",
  },
  {
    icon: CalendarDays,
    title: "Request",
    description:
      "Pick your date and time window. The total — hourly cost, deposit and any fee — is calculated before you submit.",
  },
  {
    icon: Sparkles,
    title: "Create",
    description:
      "The host confirms, you get notified, and your booking details and invoice live in your dashboard.",
  },
];

const hostSteps: InfoCard[] = [
  {
    icon: Search,
    title: "Open a host account",
    description:
      "One click converts your creator account. No new login, no second profile.",
  },
  {
    icon: CalendarDays,
    title: "Publish your listing",
    description:
      "Six steps cover the space, location, pricing, photos, amenities and rules. Your name and email are attached automatically.",
  },
  {
    icon: Sparkles,
    title: "Accept what works",
    description:
      "Requests arrive with the schedule and total attached. Confirm or decline; your calendar blocks the slot on confirmation.",
  },
];

const trustCards: InfoCard[] = [
  {
    icon: CreditCard,
    title: "Transparent pricing",
    description:
      "Hourly rate × hours, plus the host-set security deposit and any service fee. The server recalculates the total when a request is created, so the price you see is the price recorded.",
  },
  {
    icon: ShieldCheck,
    title: "Safety and trust",
    description:
      "Listings are reviewed before publishing, reviews come only from completed bookings, and hosts never see payment credentials. Access details are exchanged after confirmation.",
  },
  {
    icon: Undo2,
    title: "Cancellations",
    description:
      "Creators can cancel free of charge up to 24 hours before the session. Inside that window the host may retain the deposit. If a host cancels, nothing is charged.",
  },
  {
    icon: CalendarCheck2,
    title: "No double bookings",
    description:
      "A slot can only be confirmed once. Every confirmation re-checks the studio calendar and the host's weekly hours before the status changes.",
  },
];

const eyebrow = "mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground";

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:pb-20 lg:pt-14">
      <p className={eyebrow}>How StudioSpace works</p>
      <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-[44px]">
        A marketplace built around real availability and real work.
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
        StudioSpace connects creators who need a professional room with the
        people who own one. Every booking is a request the host approves,
        checked against a live calendar before it is confirmed.
      </p>
    </section>
  );
}

function InfoInsideCard({ card }: { card: InfoCard }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 p-6">
      <card.icon className="size-4 text-foreground/80" />
      <h3 className="text-sm font-semibold tracking-tight">{card.title}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {card.description}
      </p>
    </div>
  );
}

function CreatorsSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <p className={eyebrow}>For creators</p>
        <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
          Book the space, not the admin
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {creatorCards.map((card) => (
            <InfoInsideCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HostsSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:py-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={images.northbound}
            alt="Film sound stage with green screen"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-xl">
          <p className={eyebrow}>For hosts</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Turn unused hours into revenue
          </h2>

          <ol className="mt-8 flex flex-col gap-7">
            {hostSteps.map((step, index) => (
              <li key={step.title} className="flex items-start gap-4">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-border bg-card text-[11px] font-medium text-foreground/70">
                  0{index + 1}
                </span>
                <h3 className="flex flex-col gap-1.5 text-sm font-semibold tracking-tight">
                  {step.title}
                  <span className="text-[13px] font-normal leading-relaxed text-muted-foreground">
                    {step.description}
                  </span>
                </h3>
              </li>
            ))}
          </ol>

          <Link
            href="/add-studio"
            className="mt-9 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98]"
          >
            List your studio
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <p className={eyebrow}>Trust & process</p>
        <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Pricing, payments, safety and cancellations
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          No surprises between the quote and the invoice.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {trustCards.map((card) => (
            <InfoInsideCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-[#141410] px-6 py-14 text-center sm:py-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to see what&apos;s available near you?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studios"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98]"
            >
              Explore studios
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-full border border-white/20 px-5 text-[13px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function HowItWorksView() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <Hero />
        <CreatorsSection />
        <HostsSection />
        <TrustSection />
        <CtaSection />
      </main>
    </div>
  );
}

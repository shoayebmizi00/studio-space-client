import Image from "next/image";
import Link from "next/link";
import { Compass, Users, Sparkles, HeartHandshake, Globe, ArrowRight } from "lucide-react";
import { images } from "@/lib/home-data";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const stripImages = [
  { src: images.hero, alt: "Photography studio with cyc wall" },
  { src: images.signal, alt: "Podcast room with two microphones" },
  { src: images.daylight, alt: "Rehearsal space with barres and mirrors" },
];

type Card = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const beliefCards: Card[] = [
  {
    icon: Sparkles,
    title: "Craft over volume",
    description:
      "A listing has to be a real, usable professional space. We would rather have fewer excellent studios than a directory of maybes.",
  },
  {
    icon: HeartHandshake,
    title: "Both sides, respected",
    description:
      "Hosts set their own hours and rates. Creators see the true total before they request. Nobody is surprised afterwards.",
  },
  {
    icon: Globe,
    title: "Local by design",
    description:
      "Creative work happens in specific rooms in specific neighbourhoods. We optimise for discovering what is actually near you.",
  },
];

const teamMembers = [
  { initials: "ID", name: "Md Shoayeb Mizi", role: "Founder & product" },
  { initials: "KM", name: "Kai Morgan", role: "Design" },
  { initials: "RH", name: "Rami Haddad", role: "Engineering" },
  { initials: "SL", name: "Sofia Lindqvist", role: "Host community" },
];

const eyebrow = "mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground";

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:pt-14">
      <p className={eyebrow}>About StudioSpace</p>
      <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-[44px]">
        Creative work deserves a better room to happen in.
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
        StudioSpace started with a familiar problem: finding a professional
        space took a week of messages, phone calls and favours. Meanwhile,
        beautifully equipped studios sat empty for most of the month. We built
        the marketplace that closes that gap.
      </p>
    </section>
  );
}

function ImageStrip() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stripImages.map((image) => (
          <div key={image.alt} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function MissionVision() {
  const cards: Card[] = [
    {
      icon: Compass,
      title: "Our mission",
      description:
        "Make professional creative space as easy to book as a hotel room — transparent, available and trustworthy — so the energy that would go into logistics goes into the work instead.",
    },
    {
      icon: Users,
      title: "Our vision",
      description:
        "A creative economy where owning a studio is a viable small business, and where any independent creator can access the same rooms as the largest production company in town.",
    },
  ];

  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:pb-24">
      {cards.map((card) => (
        <div key={card.title} className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-7">
          <card.icon className="size-4 text-foreground/80" />
          <h3 className="text-lg font-semibold tracking-tight">{card.title}</h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {card.description}
          </p>
        </div>
      ))}
    </section>
  );
}

function BeliefsSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <p className={eyebrow}>What we believe</p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Three rules we don&apos;t break
        </h2>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          They shape the product decisions you experience every time you book
          or list.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {beliefCards.map((card) => (
            <div key={card.title} className="flex flex-col gap-3 rounded-2xl border border-border/70 p-6">
              <card.icon className="size-4 text-foreground/80" />
              <h3 className="text-sm font-semibold tracking-tight">{card.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <p className={eyebrow}>The team</p>
        <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Small team, obsessive about the details
        </h2>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          Designers, engineers and producers who have spent too long hunting
          for the right room.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-start gap-3 rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.03]"
            >
              <span className="grid size-10 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground/70">
                {member.initials}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] font-semibold tracking-tight">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
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
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl bg-[#141410] px-6 py-12 sm:px-10 lg:px-12">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
              Join the community of creators and studio owners.
            </h2>
            <p className="mt-4 text-[13px] text-white/60">
              Browse the marketplace, or put your own space on it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
              Talk to us
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

export function AboutView() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <Hero />
        <ImageStrip />
        <MissionVision />
        <BeliefsSection />
        <TeamSection />
        <CtaSection />
      </main>
    </div>
  );
}

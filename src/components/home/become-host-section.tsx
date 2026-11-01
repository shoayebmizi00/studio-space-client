import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { images, hostPerks } from "@/lib/home-data";
import { cn } from "cn";

export function BecomeHostSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Photo side */}
        <div className="relative min-h-[320px] overflow-hidden rounded-3xl lg:min-h-[420px]">
          <Image
            src={images.host}
            alt="Creator studio setup with mixing console"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 flex flex-col gap-0.5 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur">
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Limited availability
            </span>
            <span className="text-sm font-semibold tracking-tight">
              18 Hrs booked in monthly
            </span>
          </div>
        </div>

        {/* Copy side */}
        <div className="flex flex-col justify-center gap-6 rounded-3xl bg-card p-6 sm:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#5a7a2e]">
            Become a host
          </p>

          <h2 className="max-w-md text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Your studio is worth more than it sits empty.
          </h2>

          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            Publish your space, set your guardrails, and accept requests
            automatically or manually. StudioSpace handles discovery, checkout,
            invoicing, secure payments, and payouts.
          </p>

          <ul className="flex flex-col gap-2.5">
            {hostPerks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-[13px]">
                <span className="grid size-4 shrink-0 place-items-center rounded-full bg-primary">
                  <Check className="size-2.5" />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-2 flex flex-wrap items-center gap-5">
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-10 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground hover:brightness-95"
              )}
            >
              List your studio
              <ArrowRight className="size-3.5" />
            </a>
            <a
              href="#"
              className="text-[13px] font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              See host kit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

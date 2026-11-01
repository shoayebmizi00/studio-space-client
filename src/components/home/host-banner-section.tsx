import { SectionHeader } from "./section-header";
import { hostCards } from "@/lib/home-data";

export function HostBannerSection() {
  return (
    <section id="for-hosts" className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="grid grid-cols-1 gap-4 rounded-3xl bg-secondary/70 p-4 sm:p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Left text block */}
        <div className="flex flex-col justify-between gap-8 py-4 pr-0 sm:p-6">
          <SectionHeader
            eyebrow="For studio owners"
            title={<>List once, earn on the hours you already own.</>}
            className="mb-0"
          />
        </div>

        {/* Right cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {hostCards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-14 rounded-2xl bg-card p-5"
            >
              <span className="grid size-9 place-items-center rounded-lg border border-border text-foreground/70">
                <card.icon className="size-4" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold tracking-tight">{card.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

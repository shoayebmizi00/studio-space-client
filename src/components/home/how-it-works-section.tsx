import { SectionHeader } from "./section-header";
import { steps } from "@/lib/home-data";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeader
        eyebrow="How booking works"
        title="From discovery to shoot in four steps"
        description="StudioSpace keeps the whole exchange in one place — browsing, availability, approval, and payments."
      />

      {/* Step progress */}
      <div className="mb-6 flex items-center justify-center gap-2" aria-hidden>
        <span className="h-1 w-14 rounded-full bg-foreground/70" />
        <span className="h-1 w-14 rounded-full bg-foreground/70" />
        <span className="h-1 w-14 rounded-full bg-border" />
        <span className="h-1 w-14 rounded-full bg-border" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex flex-col gap-14 rounded-3xl border border-border/70 bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-9 place-items-center rounded-lg border border-border text-foreground/70">
                <step.icon className="size-4" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                0{index + 1}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[15px] font-semibold tracking-tight">{step.title}</h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

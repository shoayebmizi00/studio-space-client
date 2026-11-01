import { SectionHeader } from "./section-header";
import { StarRating } from "./star-rating";
import { testimonials } from "@/lib/home-data";

export function TestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:pb-24">
      <SectionHeader
        eyebrow="Testimonials"
        title="Creators and hosts, in their own words"
        description="A marketplace works when both sides of it win. Here's what they said next."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex flex-col justify-between gap-10 rounded-3xl border border-border/70 bg-card p-6"
          >
            <blockquote className="text-[13px] leading-relaxed text-foreground/85">
              {testimonial.quote}
            </blockquote>
            <figcaption className="flex flex-col gap-2">
              <StarRating rating={5} />
              <span className="text-[13px] font-semibold tracking-tight">
                {testimonial.name}
              </span>
              <span className="text-xs text-muted-foreground">{testimonial.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

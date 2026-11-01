import { Plus } from "lucide-react";
import { faqs } from "@/lib/home-data";

export function FaqSection() {
  return (
    <section
      id="faq"
      className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:py-24"
    >
      <div>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          FAQ
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Answers before you book
        </h2>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
          The quick version. If you need the whole toolkit, the full library is
          one more tab down.
        </p>
      </div>

      <div className="flex flex-col">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            open={index === 0}
            className="group border-b border-border first:border-t"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] font-medium tracking-tight [&::-webkit-details-marker]:hidden">
              {faq.question}
              <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="pb-5 pr-8 text-[13px] leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { images } from "@/lib/home-data";
import { SearchBar } from "./search-bar";

export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-3 sm:px-4">
      <div className="relative overflow-hidden rounded-3xl bg-[#191713]">
        {/* Background photo */}
        <Image
          src={images.hero}
          alt="Photo studio with lighting rigs"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />

        {/* Content */}
        <div className="relative flex flex-col items-start px-5 pb-8 pt-14 sm:px-10 sm:pt-20 lg:px-14 lg:pt-24">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            75+ Studios & Spaces
          </p>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
            Find Your Space. Create Something Extraordinary.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Book photo, film, music, content, and podcast studios by the hour —
            with live pricing, instant booking, and real availability.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#explore"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98]"
            >
              Explore studios
              <ArrowRight className="size-3.5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-10 items-center rounded-full border border-white/25 px-5 text-[13px] font-medium text-white transition-colors hover:bg-white/10"
            >
              How it works
            </a>
          </div>

          {/* Search card */}
          <div className="mt-10 w-full lg:mt-12 lg:pr-24">
            <SearchBar />
          </div>

          {/* Carousel controls */}
          <div className="mt-4 flex w-full items-center justify-between">
            <div className="flex items-center gap-1.5 pl-1">
              <span className="h-1.5 w-6 rounded-full bg-primary" />
              <span className="size-1.5 rounded-full bg-white/30" />
              <span className="size-1.5 rounded-full bg-white/30" />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                className="grid size-8 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:bg-white/10"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                className="grid size-8 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:bg-white/10"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

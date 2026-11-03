"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/home-data";
import { SearchBar } from "./search-bar";

type Slide = {
  image: StaticImageData;
  alt: string;
  eyebrow: string;
};

const slides: Slide[] = [
  {
    image: images.hero,
    alt: "Photo studio with lighting rigs",
    eyebrow: "Creative studios by local hosts",
  },
  {
    image: images.ristorare,
    alt: "Content creation studio with a ring light",
    eyebrow: "Content studios, shoot-ready",
  },
  {
    image: images.signal,
    alt: "Podcast room with two microphones",
    eyebrow: "Podcast rooms for recording",
  },
];

const slideCount = slides.length;

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance; re-created on every change so a manual jump restarts the timer.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % slideCount), 6000);
    return () => clearInterval(id);
  }, [index, paused]);

  const goTo = (next: number) => setIndex((next + slideCount) % slideCount);
  const active = slides[index];

  return (
    <section className="mx-auto w-full max-w-7xl px-3 sm:px-4">
      <div
        className="relative overflow-hidden rounded-3xl bg-[#191713]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background photos, cross-fading */}
        {slides.map((slide, slideIndex) => (
          <Image
            key={slide.alt}
            src={slide.image}
            alt={slideIndex === index ? slide.alt : ""}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ${
              slideIndex === index ? "opacity-80" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-black/70" />

        {/* Content */}
        <div className="relative flex flex-col items-start px-5 pb-8 pt-14 sm:px-10 sm:pt-20 lg:px-14 lg:pt-24">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            {active.eyebrow}
          </p>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
            Find Your Space. Create Something Extraordinary.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Explore photo, film, music, content, and podcast studios with host-provided
            details and hourly pricing.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/studios"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-95 active:scale-[0.98]"
            >
              Explore Studios
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 px-5 text-[13px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Host Your Space
            </Link>
          </div>

          {/* Search card */}
          <div className="mt-10 w-full lg:mt-12 lg:pr-24">
            <SearchBar />
          </div>

          {/* Carousel controls */}
          <div className="mt-4 flex w-full items-center justify-between">
            <div className="flex items-center gap-1.5 pl-1">
              {slides.map((slide, slideIndex) => (
                <Button
                  key={slide.alt}
                  type="button"
                  aria-label={`Go to slide ${slideIndex + 1}`}
                  aria-current={slideIndex === index}
                  onClick={() => goTo(slideIndex)}
                  className={`h-1.5 rounded-full bg-white/30 transition-all hover:bg-white/60 ${
                    slideIndex === index ? "w-6 bg-primary" : "w-1.5"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                aria-label="Previous slide"
                onClick={() => goTo(index - 1)}
                className="grid size-8 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:bg-white/10"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                aria-label="Next slide"
                onClick={() => goTo(index + 1)}
                className="grid size-8 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:bg-white/10"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

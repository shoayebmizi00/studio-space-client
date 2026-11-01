export function CtaBannerSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="relative flex flex-col items-center overflow-hidden rounded-3xl bg-[#101208] px-6 py-20 text-center sm:py-28">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full bg-[#3a5a1a]/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/4 size-80 rounded-full bg-[#25501f]/35 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-[36rem] -translate-x-1/2 rounded-full bg-[#4a6b21]/25 blur-3xl"
        />

        <div className="relative flex flex-col items-center">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cff54a]/30 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#cff54a]">
            <span className="size-1.5 rounded-full bg-[#cff54a]" />
            Create · Collaborate · Produce
          </p>

          <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white text-balance sm:text-5xl">
            Your next shoot deserves the right room.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60">
            Join thousands of creators booking professional space by the hour —
            or open your own studio in the neighborhood you live in, and start
            filling the hours you already own.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#explore"
              className="inline-flex h-10 items-center rounded-full bg-[#cff54a] px-5 text-[13px] font-medium text-[#1b1b16] transition-transform hover:brightness-95 active:scale-[0.98]"
            >
              Explore spaces
            </a>
            <a
              href="#for-hosts"
              className="inline-flex h-10 items-center rounded-full border border-white/20 px-5 text-[13px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Become a host
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

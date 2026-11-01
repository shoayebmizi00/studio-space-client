"use client";

import { Globe, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { cn } from "cn";

const links = [
  { label: "Explore studios", href: "/studios" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Add a studio", href: "/add-studio" },
  { label: "Contact", href: "/contact" },
];

/**
 * Shared site navbar, rendered once in `src/app/layout.tsx`.
 * Active link is derived from the pathname; right-side controls and the
 * band background switch between the landing and app variants.
 */
export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header
      className={cn(
        // Match the current page's band color (studios page is lighter).
        isLanding ? "bg-background" : "bg-[#faf9f3]",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-foreground/80 hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isLanding ? (
            <>
              <button
                type="button"
                aria-label="Change language"
                className="hidden items-center gap-1.5 rounded-full px-2 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:text-foreground sm:flex"
              >
                <Globe className="size-4" />
                EN
              </button>
              <Link
                href="/studios"
                className="flex h-9 items-center rounded-full border border-border bg-card px-4 text-[13px] font-medium transition-colors hover:border-foreground/25"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                aria-label="Toggle theme"
                className="grid size-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                <Moon className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Account menu"
                className="flex items-center gap-2 rounded-full border border-border/70 bg-card py-1 pl-1 pr-3.5 transition-colors hover:border-foreground/20"
              >
                <span className="grid size-6 place-items-center rounded-full bg-foreground text-[10px] font-semibold text-primary">
                  MS
                </span>
                <span className="text-[13px] font-medium">Md</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, LogOut, Moon, Sun, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { useTheme } from "@/hooks/use-theme";
import { Logo } from "./logo";
import { cn } from "cn";

const links = [
  { label: "Explore studios", href: "/studios" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Add a studio", href: "/add-studio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const menuLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My bookings", href: "/my-bookings" },
  { label: "Add a studio", href: "/add-studio" },
  { label: "Profile", href: "/profile" },
];

function initialsOf(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0];
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

/**
 * Shared site navbar, rendered once in `src/app/layout.tsx`.
 * Active link is derived from the pathname; the right side switches between
 * signed-out (theme + Sign in / Sign up) and signed-in (theme + avatar menu).
 */
export function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // better-auth live session: undefined while loading.
  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Close the avatar menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Full-screen auth pages render their own logo — no shared chrome.
  if (pathname === "/sign-in" || pathname === "/sign-up") return null;

  const isLanding = pathname === "/";

  const signOut = async () => {
    setMenuOpen(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={cn(
        // Match the current page's band color (studios page is lighter).
        isLanding ? "bg-background" : "bg-surface-alt",
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

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle — works on light and dark */}
          <button
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={toggle}
            className="grid size-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          {isLanding && !user ? (
            <button
              type="button"
              aria-label="Change language"
              className="hidden items-center gap-1.5 rounded-full px-2 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:text-foreground sm:flex"
            >
              <Globe className="size-4" />
              EN
            </button>
          ) : null}

          {isPending && !user ? (
            // Skeleton chip while the session resolves, prevents auth flicker.
            <span className="size-8 rounded-full bg-muted" aria-hidden />
          ) : user ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-border/70 bg-card py-1 pl-1 pr-3 transition-colors hover:border-foreground/20"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                    className="size-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-6 place-items-center rounded-full bg-foreground text-[10px] font-semibold text-primary">
                    {initialsOf(user.name ?? "", user.email ?? "")}
                  </span>
                )}
                <span className="hidden max-w-24 truncate text-[13px] font-medium sm:inline">
                  {(user.name ?? user.email).split(" ")[0]}
                </span>
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg">
                  <div className="mb-1 px-2.5 pb-2 pt-1.5">
                    <p className="truncate text-[13px] font-semibold tracking-tight">
                      {user.name ?? "Signed in"}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="mb-1 h-px bg-border" />
                  {menuLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors hover:bg-secondary"
                    >
                      <UserRound className="size-3.5 text-muted-foreground" />
                      {link.label}
                    </Link>
                  ))}
                  <div className="my-1 h-px bg-border" />
                  <button
                    type="button"
                    onClick={signOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-red-600 transition-colors hover:bg-secondary"
                  >
                    <LogOut className="size-3.5" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="flex h-9 items-center rounded-full px-3 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="flex h-9 items-center rounded-full border border-border bg-card px-4 text-[13px] font-medium transition-colors hover:border-foreground/25"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

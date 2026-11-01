"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "studiotheme";
export type Theme = "light" | "dark";

function readInitialTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

/**
 * Theme state bound to the `dark` class on <html>.
 * `layout.tsx` runs a tiny inline script before hydration so the first
 * paint already matches the stored/system preference.
 */
export function useTheme() {
  // Lazy init: on the server this is "light"; on the client it reads the
  // stored/system preference, which the anti-flash script already applied.
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === "undefined" ? "light" : readInitialTheme()
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = () =>
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode — theme just won't persist */
      }
      return next;
    });

  return { theme, toggle };
}

"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

/**
 * Saved studios wishlist, stored in MongoDB through /api/saved.
 * The state lives in a tiny module store so every component (navbar
 * badge, cards, details page) stays in sync.
 */

const emptyIds: string[] = [];

let savedIds: string[] = emptyIds;
let loadedFor: string | null = null; // user id the list was loaded for
let loadingFor: string | null | undefined; // in-flight request (undefined = none)
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function setIds(next: string[]) {
  savedIds = next;
  emit();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return savedIds;
}

function getServerSnapshot() {
  return emptyIds;
}

/* Load my wishlist from the server (empty when signed out). */
async function loadSaved(): Promise<string[]> {
  try {
    const res = await fetch("/api/saved", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

function toggleSavedStudio(id: string): boolean {
  if (!id) return false;

  const previous = savedIds;
  const alreadySaved = previous.includes(id);
  const next = alreadySaved
    ? previous.filter((item) => item !== id)
    : [...previous, id];

  // Optimistic update: show the new state immediately.
  setIds(next);

  const request = alreadySaved
    ? fetch(`/api/saved/${id}`, { method: "DELETE" })
    : fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studioId: id }),
      });

  request
    .then(async (res) => {
      if (res.status === 401) {
        setIds(previous);
        toast.error("Sign in to save studios", {
          description: "Create a free account to keep your favourite spaces.",
        });
        return;
      }
      if (!res.ok) {
        throw new Error("Request failed");
      }
    })
    .catch(() => {
      setIds(previous);
      toast.error("Could not update your saved studios", {
        description: "Please try again.",
      });
    });

  return !alreadySaved;
}

function clearAllSavedStudios() {
  const previous = savedIds;
  setIds([]);

  fetch("/api/saved", { method: "DELETE" })
    .then(async (res) => {
      if (!res.ok) throw new Error("Request failed");
    })
    .catch(() => {
      setIds(previous);
      toast.error("Could not clear your saved studios", {
        description: "Please try again.",
      });
    });
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

/**
 * React hook: saved studios for the signed-in user, kept in sync
 * across every component that uses it.
 */
export function useSavedStudios() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id ?? null;

  // Re-render this component whenever the wishlist changes.
  const currentIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Load the wishlist whenever the signed-in user changes.
  useEffect(() => {
    if (isPending) return;
    if (loadedFor === userId && loadedFor !== null) return;
    if (userId === null && loadedFor === null) return; // already known as signed out
    if (loadingFor === userId) return; // request already running

    let active = true;
    loadingFor = userId;
    loadSaved().then((ids) => {
      loadingFor = undefined;
      if (!active) return;
      loadedFor = userId;
      setIds(ids);
    });

    return () => {
      active = false;
    };
  }, [userId, isPending]);

  const toggle = useCallback((id: string) => toggleSavedStudio(id), []);
  const clearAll = useCallback(() => clearAllSavedStudios(), []);
  const has = useCallback(
    (id: string) => currentIds.includes(id),
    [currentIds]
  );

  return {
    savedIds: currentIds,
    count: currentIds.length,
    isLoaded: !isPending,
    has,
    toggle,
    clearAll,
  };
}

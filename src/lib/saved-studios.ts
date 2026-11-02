"use client";

import { useSyncExternalStore, useCallback } from "react";

export const SAVED_STUDIOS_STORAGE_KEY = "studiospace:saved";
const SAVED_CHANGE_EVENT = "studiospace:saved-change";

export function getSavedStudioIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_STUDIOS_STORAGE_KEY);
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setSavedStudioIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVED_STUDIOS_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(SAVED_CHANGE_EVENT));
  } catch {
    /* private mode / quota exceeded */
  }
}

export function isStudioSaved(id: string): boolean {
  if (!id) return false;
  return getSavedStudioIds().includes(id);
}

export function toggleSavedStudio(id: string): boolean {
  if (!id) return false;
  const current = getSavedStudioIds();
  const alreadySaved = current.includes(id);
  const next = alreadySaved ? current.filter((item) => item !== id) : [...current, id];
  setSavedStudioIds(next);
  return !alreadySaved;
}

export function clearAllSavedStudios(): void {
  setSavedStudioIds([]);
}

function subscribe(callback: () => void) {
  window.addEventListener(SAVED_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SAVED_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

let cachedRaw: string | null = null;
let cachedIds: string[] = [];
const emptyIds: string[] = [];

function getSnapshot(): string[] {
  if (typeof window === "undefined") return emptyIds;
  try {
    const raw = localStorage.getItem(SAVED_STUDIOS_STORAGE_KEY) ?? "[]";
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const parsed = JSON.parse(raw);
      cachedIds = Array.isArray(parsed) ? parsed : [];
    }
    return cachedIds;
  } catch {
    return emptyIds;
  }
}

function getServerSnapshot(): string[] {
  return emptyIds;
}

/**
 * React hook to listen for saved studios updates in realtime across components and windows.
 */
export function useSavedStudios() {
  const savedIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: string) => {
    return toggleSavedStudio(id);
  }, []);

  const has = useCallback(
    (id: string) => {
      return savedIds.includes(id);
    },
    [savedIds]
  );

  return {
    savedIds,
    count: savedIds.length,
    isLoaded: true,
    has,
    toggle,
    clearAll: clearAllSavedStudios,
  };
}

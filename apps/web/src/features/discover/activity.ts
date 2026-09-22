"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "animaps-discover-activity";

export type DiscoverActivity = {
  likes: string[];
  favorites: string[];
  matches: string[];
};

const EMPTY: DiscoverActivity = { likes: [], favorites: [], matches: [] };

let memory: DiscoverActivity = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function readStored(): DiscoverActivity {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DiscoverActivity>;
    return {
      likes: parsed.likes ?? [],
      favorites: parsed.favorites ?? [],
      matches: parsed.matches ?? [],
    };
  } catch {
    return EMPTY;
  }
}

function emit(next: DiscoverActivity) {
  memory = next;
  hydrated = true;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  memory = readStored();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  queueMicrotask(() => {
    if (hydrated) return;
    load();
    listeners.forEach((item) => item());
  });
  return () => listeners.delete(listener);
}

function snapshot() {
  return memory;
}

export function useDiscoverActivity() {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

function uniquePush(list: string[], id: string) {
  return list.includes(id) ? list : [...list, id];
}

export function recordDiscoverAction(
  id: string,
  action: "like" | "favorite",
  reciprocates: boolean,
) {
  load();
  if (action === "favorite") {
    emit({ ...memory, favorites: uniquePush(memory.favorites, id) });
    return "favorite" as const;
  }
  const likes = uniquePush(memory.likes, id);
  const matches = reciprocates ? uniquePush(memory.matches, id) : memory.matches;
  emit({ ...memory, likes, matches });
  return reciprocates ? ("match" as const) : ("like" as const);
}

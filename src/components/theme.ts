"use client";

import { useSyncExternalStore } from "react";

export type Mode = "blossom" | "matcha";
export const MODES: Mode[] = ["blossom", "matcha"];

const read = (): Mode => (document.documentElement.dataset.theme === "matcha" ? "matcha" : "blossom");

export function setMode(next: Mode) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

/* The current mode, kept in sync with data-theme on <html> */
export function useMode(): Mode {
  return useSyncExternalStore(
    (changed) => {
      const mo = new MutationObserver(changed);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => mo.disconnect();
    },
    read,
    () => "blossom",
  );
}

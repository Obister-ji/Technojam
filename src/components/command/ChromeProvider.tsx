"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import type { SearchItem } from "@/lib/search/types";
import type { ConsoleData } from "./TechnoJamConsole";

// Both overlays are code-split: they cost nothing until someone opens them.
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });
const TechnoJamConsole = dynamic(() => import("./TechnoJamConsole"), { ssr: false });

type Overlay = "palette" | "console" | null;

interface ChromeContextValue {
  openPalette: () => void;
  openConsole: () => void;
  close: () => void;
}

const ChromeContext = createContext<ChromeContextValue | null>(null);

export function useChrome() {
  const ctx = useContext(ChromeContext);
  if (!ctx) throw new Error("useChrome must be used inside <ChromeProvider>");
  return ctx;
}

export function ChromeProvider({ consoleData, children }: { consoleData: ConsoleData; children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [index, setIndex] = useState<SearchItem[]>([]);
  const requested = useRef(false);

  // The search index is a static JSON file, loaded on first open only.
  const loadIndex = useCallback(() => {
    if (requested.current) return;
    requested.current = true;
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((items: SearchItem[]) => setIndex(items))
      .catch(() => {
        requested.current = false;
      });
  }, []);

  const open = useCallback(
    (which: Exclude<Overlay, null>) => {
      loadIndex();
      setOverlay(which);
      track(which === "palette" ? "command_palette_open" : "console_open");
    },
    [loadIndex],
  );
  const openPalette = useCallback(() => open("palette"), [open]);
  const openConsole = useCallback(() => open("console"), [open]);
  const close = useCallback(() => setOverlay(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        loadIndex();
        setOverlay((o) => (o === "palette" ? null : "palette"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loadIndex]);

  const value = useMemo(() => ({ openPalette, openConsole, close }), [openPalette, openConsole, close]);

  return (
    <ChromeContext.Provider value={value}>
      {children}
      {overlay === "palette" ? <CommandPalette index={index} onClose={close} onOpenConsole={openConsole} /> : null}
      {overlay === "console" ? <TechnoJamConsole index={index} data={consoleData} onClose={close} /> : null}
    </ChromeContext.Provider>
  );
}

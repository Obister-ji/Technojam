"use client";

import { useEffect, useRef } from "react";

/**
 * Opens a native <dialog> as a modal on mount. The browser gives us the
 * top layer, an inert background, Escape handling and focus return.
 */
export function useModalDialog(onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    document.documentElement.style.overflow = "hidden";

    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    const onClick = (e: MouseEvent) => {
      // Click on the backdrop (the dialog element itself, outside its panel)
      if (e.target === dialog) onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("click", onClick);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onClick);
      document.documentElement.style.overflow = "";
      if (dialog.open) dialog.close();
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return ref;
}

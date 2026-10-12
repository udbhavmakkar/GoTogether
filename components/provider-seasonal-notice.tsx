"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ProviderSeasonalNotice() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="provider-seasonal-notice-title"
      aria-describedby="provider-seasonal-notice-description"
      className="fixed bottom-4 right-4 z-[55] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-amber-200 bg-white p-4 shadow-xl sm:bottom-6 sm:right-6"
    >
      <h2 id="provider-seasonal-notice-title" className="text-base font-semibold text-slate-900">
        A little Diwali travel update
      </h2>
      <p id="provider-seasonal-notice-description" className="mt-2 text-sm leading-6 text-slate-600">
        Taxi fares may rise during Diwali. Latif&apos;s Chennai Airport and VIT fares currently start at
        {" "}&#8377;2,500 and vary with demand.
      </p>
      <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
        Mention <strong>&quot;GoTogether&quot;</strong> on the call to receive our agreed discount with Latif Taxis.
        Please confirm your final fare before booking.
      </p>
      <Button size="sm" className="mt-3 w-full" onClick={() => setIsOpen(false)}>
        Got it, thank you
      </Button>
    </aside>
  );
}

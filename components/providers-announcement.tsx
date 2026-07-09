"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const INACTIVITY_THRESHOLD_MS = 2 * 60 * 1000;

export function ProvidersAnnouncement() {
  const [isOpen, setIsOpen] = useState(false);
  const lastActiveAtRef = useRef(Date.now());

  useEffect(() => {
    setIsOpen(true);

    function markActive() {
      lastActiveAtRef.current = Date.now();
    }

    function maybeReopen() {
      const now = Date.now();

      if (document.visibilityState === "visible" && now - lastActiveAtRef.current >= INACTIVITY_THRESHOLD_MS) {
        setIsOpen(true);
      }

      markActive();
    }

    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("touchstart", markActive);
    window.addEventListener("focus", maybeReopen);
    document.addEventListener("visibilitychange", maybeReopen);

    return () => {
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("touchstart", markActive);
      window.removeEventListener("focus", maybeReopen);
      document.removeEventListener("visibilitychange", maybeReopen);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">New on GoTogether</p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ganesh Taxis</h2>
          <div className="space-y-2 text-sm leading-6 text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Phone number:</span> 7829976680
            </p>
            <p>
              <span className="font-semibold text-slate-900">Price from Chennai to Vellore:</span> 2100/-
            </p>
            <p>
              While talking to the person, take the name of{" "}
              <span className="font-semibold text-slate-900">&quot;GoTogether website&quot;</span>. They will give
              discount also.
            </p>
            <p>Any review of this person, put it in the suggestion/feedback box in the website.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/providers"
            className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={() => setIsOpen(false)}
          >
            View provider details
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

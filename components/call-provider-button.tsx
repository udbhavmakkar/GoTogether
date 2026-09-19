"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { notifyProviderContact } from "@/api/client";

type CallProviderButtonProps = {
  providerId: string;
  phone: string;
  isLoggedIn: boolean;
};

export function CallProviderButton({ providerId, phone, isLoggedIn }: CallProviderButtonProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    if (!showLoginDialog) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowLoginDialog(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showLoginDialog]);

  if (isLoggedIn) {
    return (
      <a
        href={`tel:${phone.replace(/\s+/g, "")}`}
        onClick={() => notifyProviderContact(providerId)}
        className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Call provider
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowLoginDialog(true)}
        className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Call provider
      </button>

      {showLoginDialog ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setShowLoginDialog(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="provider-login-title"
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <h2 id="provider-login-title" className="text-2xl font-bold tracking-tight text-slate-900">
              Login required
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              You need to login with your VIT email before calling a provider.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login?message=provider-access&next=/providers"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Go to Login
              </Link>
              <button
                type="button"
                onClick={() => setShowLoginDialog(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

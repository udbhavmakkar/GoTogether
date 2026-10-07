"use client";

import Image from "next/image";
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
  const [showEmailNotice, setShowEmailNotice] = useState(false);

  useEffect(() => {
    if (!showLoginDialog && !showEmailNotice) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowLoginDialog(false);
        setShowEmailNotice(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showEmailNotice, showLoginDialog]);

  if (isLoggedIn) {
    return (
      <>
        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          onClick={() => {
            notifyProviderContact(providerId);
            setShowEmailNotice(true);
          }}
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Call provider
        </a>

        {showEmailNotice ? (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-6"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) {
                setShowEmailNotice(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="provider-email-notice-title"
              className="w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Email confirmation</p>
              <h2
                id="provider-email-notice-title"
                className="mt-2 text-2xl font-bold tracking-tight text-slate-900"
              >
                Please check your Spam folder
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                We are sending a personalised booking confirmation to your VIT email. GoTogether emails may currently
                arrive in Gmail&apos;s Spam folder.
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src="/gmail-spam-folder-guide.png"
                    alt="Gmail navigation showing the Spam folder"
                    width={700}
                    height={720}
                    className="h-auto w-full"
                    priority
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[23%] top-[51%] h-[14%] w-[39%] rounded-xl border-4 border-rose-500 bg-rose-500/10 shadow-[0_0_0_3px_rgba(255,255,255,0.9)]"
                  />
                  <span className="absolute right-3 top-[53%] rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    Open Spam
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950">
                Please open the GoTogether email and select <strong>Not spam</strong>. This helps our future booking
                updates reach your inbox.
              </div>

              <button
                type="button"
                onClick={() => setShowEmailNotice(false)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Got it
              </button>
            </div>
          </div>
        ) : null}
      </>
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

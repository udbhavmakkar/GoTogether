import type { Metadata } from "next";
import Link from "next/link";

import { ProviderFollowUpFeedbackForm } from "@/components/provider-follow-up-feedback-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Provider follow-up | GoTogether",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ProviderFollowUpThanksPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; response?: string; token?: string }>;
}) {
  const params = await searchParams;
  const isValid = params?.status === "recorded";
  const isBooked = params?.response === "BOOKED";

  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        {isValid ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">GoTogether follow-up</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Thanks for letting us know.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your response has been recorded and will help us monitor provider quality.
            </p>
            {isBooked && params?.token ? <ProviderFollowUpFeedbackForm token={params.token} /> : null}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">This link is not valid.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The follow-up link may be incomplete or no longer available.
            </p>
          </>
        )}

        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/">Return to GoTogether</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

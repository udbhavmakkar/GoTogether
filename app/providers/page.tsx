import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providers } from "@/lib/providers";

export default function ProvidersPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Providers</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Trusted cab providers</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Use this section when you need a direct cab option instead of a shared student ride. Contact the provider
            directly for availability and final confirmation.
          </p>
        </div>
      </div>

      {providers.length === 0 ? (
        <Card className="mt-8 border-slate-200">
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Trusted cab providers will be listed here shortly.</p>
            <p>Check back soon for provider contact numbers, cab types, and fare details.</p>
            <Link
              href="/feedback"
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Suggest a provider
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {providers.map((provider) => (
            <Card key={provider.id} className="border-slate-200">
              <CardHeader className="space-y-3">
                <div className="space-y-1">
                  <CardTitle>{provider.name}</CardTitle>
                  <p className="text-sm font-medium text-slate-600">{provider.phone}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {provider.cabTypes.map((cabType) => (
                    <span
                      key={cabType}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {cabType}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Pricing</p>
                  <div className="space-y-2">
                    {provider.pricing.map((entry) => (
                      <div
                        key={`${provider.id}-${entry.label}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                      >
                        <span className="text-slate-600">{entry.label}</span>
                        <span className="font-semibold text-slate-900">{entry.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {provider.notes ? <p className="text-sm leading-6 text-slate-600">{provider.notes}</p> : null}

                <a
                  href={`tel:${provider.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Call provider
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

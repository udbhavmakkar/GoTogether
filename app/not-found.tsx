import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-3xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Ride not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The ride you requested does not exist or may have been removed.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

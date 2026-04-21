import Link from "next/link";
import { redirect } from "next/navigation";

import { GoogleAuthCard } from "@/components/google-auth-card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string; next?: string }>;
}) {
  const currentUser = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const message = resolvedSearchParams?.message;
  const callbackUrl = resolvedSearchParams?.next?.startsWith("/") ? resolvedSearchParams.next : "/";

  if (currentUser) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Login</h1>
        <p className="text-sm text-slate-600">Sign in with Google using your VIT email ID. Student and alumni accounts are allowed. On phones, make sure you choose your VIT account instead of a personal Gmail.</p>
      </div>
      {message === "ride-access" ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You need to login first to open ride details.
        </div>
      ) : null}
      <GoogleAuthCard mode="login" callbackUrl={callbackUrl} />
      <div className="text-sm text-slate-600">
        First time here?{" "}
        <Button asChild variant="ghost" size="sm">
          <Link href="/register">Go to Register</Link>
        </Button>
      </div>
    </div>
  );
}

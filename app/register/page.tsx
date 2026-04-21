import Link from "next/link";
import { redirect } from "next/navigation";

import { GoogleAuthCard } from "@/components/google-auth-card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const currentUser = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams?.next?.startsWith("/") ? resolvedSearchParams.next : "/";

  if (currentUser) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Register</h1>
        <p className="text-sm text-slate-600">Register with Google using your VIT email ID. Student and alumni accounts are allowed. If your phone shows Gmail by default, switch to your VIT Google account.</p>
      </div>
      <GoogleAuthCard mode="register" callbackUrl={callbackUrl} />
      <div className="text-sm text-slate-600">
        Already registered?{" "}
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    </div>
  );
}

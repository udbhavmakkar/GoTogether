import Link from "next/link";
import { redirect } from "next/navigation";

import { GoogleAuthCard } from "@/components/google-auth-card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/profile");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Login</h1>
        <p className="text-sm text-slate-600">Sign in with Google using your `@vitstudent.ac.in` account. On phones, make sure you choose your VIT account instead of a personal Gmail.</p>
      </div>
      <GoogleAuthCard mode="login" />
      <div className="text-sm text-slate-600">
        First time here?{" "}
        <Button asChild variant="ghost" size="sm">
          <Link href="/register">Go to Register</Link>
        </Button>
      </div>
    </div>
  );
}

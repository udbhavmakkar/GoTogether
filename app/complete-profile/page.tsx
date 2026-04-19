import { redirect } from "next/navigation";

import { CompleteProfileForm } from "@/components/complete-profile-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CompleteProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.gender) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Complete profile</h1>
        <p className="text-sm text-slate-600">
          Before you host or join rides, tell us your gender so it can be shown in ride membership details for safety and transparency.
        </p>
      </div>
      <CompleteProfileForm />
    </div>
  );
}

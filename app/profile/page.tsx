import Link from "next/link";

import { ProfileManager } from "@/components/profile-manager";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-4xl items-center px-6 py-12">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Login required</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Your profile and ride history are available after you sign in with your GoTogether account.
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser.gender) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-4xl items-center px-6 py-12">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Complete your profile first</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Add your gender before accessing your profile and ride history.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/complete-profile">Complete Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
        <p className="text-sm text-slate-600">
          Manage your account here. Expired rides are automatically removed from the system after their ride date passes.
        </p>
      </div>
      <ProfileManager currentUser={currentUser} />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-soft">
        Old rides and their chat history are deleted automatically after the ride date has passed. User accounts stay active.
      </div>
    </div>
  );
}

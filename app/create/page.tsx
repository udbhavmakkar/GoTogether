import Link from "next/link";

import { CreateRideForm } from "@/components/create-ride-form";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CreateRidePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-4xl items-center px-6 py-12">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Log in first</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Ride creation is tied to your student account. Log in or register first, then come back here to host rides.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/login">Go to Login</Link>
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
            Add your gender before hosting rides so other students can see the information in ride details.
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create a ride</h1>
        <p className="text-sm text-slate-600">Hosting as {currentUser.name}. Add the trip details and the host seat will be reserved automatically.</p>
      </div>
      <CreateRideForm currentUserGender={currentUser.gender} />
    </div>
  );
}

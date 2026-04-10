import Link from "next/link";

import { RideList } from "@/components/ride-list";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getUserRideCollections } from "@/lib/rides";

export const dynamic = "force-dynamic";

export default async function MyRidesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-4xl items-center px-6 py-12">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Log in first</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            `My Rides` depends on your logged-in student account. Log in to see the rides you are hosting or have joined.
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
            Add your gender before viewing and managing your ride memberships.
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

  const { upcomingHosted, upcomingJoined } = await getUserRideCollections(currentUser.id, new Date());

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Rides</h1>
        <p className="text-sm text-slate-600">
          Track the rides you are hosting and the rides you have joined. Open any ride to chat, coordinate, or exit if you are a passenger.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <RideList
          title="Rides you created"
          description="Upcoming rides where you are the host."
          rides={upcomingHosted}
          currentUserId={currentUser.id}
          emptyText="You are not hosting any upcoming rides."
        />
        <RideList
          title="Rides you joined"
          description="Upcoming rides where you are riding with someone else."
          rides={upcomingJoined}
          currentUserId={currentUser.id}
          emptyText="You have not joined any upcoming rides."
        />
      </div>
    </div>
  );
}

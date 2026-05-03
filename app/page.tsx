import { redirect } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { RideBrowser } from "@/components/ride-browser";
import { ScrollToRidesButton } from "@/components/scroll-to-rides-button";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { listPublicRides, listRides } from "@/lib/rides";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  // If logged in but profile incomplete, redirect to complete-profile
  if (currentUser && !currentUser.gender) {
    redirect("/complete-profile");
  }

  if (!currentUser) {
    const rides = await listPublicRides();

    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-soft sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                GoTogether
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                See active ride routes before you sign in. Login is required before opening a ride, viewing members, or joining a trip.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/login">Login with VIT Email</Link>
              </Button>
              <ScrollToRidesButton label="See Available Rides" />
            </div>
          </div>
          <div className="grid gap-4 rounded-[1.5rem] bg-slate-900 p-6 text-slate-50">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Live ride board</p>
              <p className="mt-3 text-2xl font-semibold">{rides.length} active rides</p>
            </div>
            <div className="grid gap-3 text-sm text-slate-300">
              <p>1. Check which routes are currently active.</p>
              <p>2. Login with your VIT email ID to open ride details.</p>
              <p>3. Join a ride and coordinate inside the ride chat.</p>
              <p>4. Get notified on email when your ride updates. If you do not see it, check your spam folder.</p>
            </div>
          </div>
        </section>

        <section id="available-rides" className="scroll-mt-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Available rides</h2>
              <p className="mt-1 text-sm text-slate-600">Routes, dates, timing, and seat availability are visible here. Member identities stay hidden until login.</p>
            </div>
          </div>

          {rides.length === 0 ? (
            <EmptyState />
          ) : (
            <RideBrowser requireLogin rides={rides} />
          )}
        </section>
      </div>
    );
  }

  const rides = await listRides();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-soft sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Campus ride coordination
          </span>
          <div className="space-y-3">
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Coordinate student rides without turning this into a taxi app.</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Create a ride, share available seats, let others join, and keep coordination in one chat thread for the trip.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/create">Create Ride</Link>
            </Button>
            <ScrollToRidesButton />
          </div>
        </div>
        <div className="grid gap-4 rounded-[1.5rem] bg-slate-900 p-6 text-slate-50">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Live ride board</p>
            <p className="mt-3 text-2xl font-semibold">{rides.length} active rides</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-300">
            <p>1. Create a ride with pickup point, drop location, timing, and total people</p>
            <p>2. Filter rides and pick the group that fits your travel needs</p>
            <p>3. Join a ride and coordinate in the chat thread</p>
            <p>4. Get notified on email when your ride updates. If you do not see it, check your spam folder.</p>
          </div>
        </div>
      </section>

      <section id="available-rides" className="scroll-mt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Available rides</h2>
            <p className="mt-1 text-sm text-slate-600">See open trips, check seat availability, and jump into the details.</p>
          </div>
        </div>

        {rides.length === 0 ? (
          <EmptyState />
        ) : (
          <RideBrowser currentUserGender={currentUser?.gender} rides={rides} />
        )}
      </section>
    </div>
  );
}

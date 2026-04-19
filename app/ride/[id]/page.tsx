import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";

import { ChatPanel } from "@/components/chat-panel";
import { DeleteRideButton } from "@/components/delete-ride-button";
import { JoinRideButton } from "@/components/join-ride-button";
import { LeaveRideButton } from "@/components/leave-ride-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/auth";
import { genderLabels } from "@/lib/constants";
import { formatRideDate } from "@/lib/format";
import { getRideById } from "@/lib/rides";

export const dynamic = "force-dynamic";

export default async function RideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, currentUser] = await Promise.all([params, getCurrentUser()]);
  const ride = await getRideById(id);

  if (!ride) {
    notFound();
  }

  const joinedUserIds = new Set(ride.joinedUsers.map((booking) => booking.userId));
  const isJoined = currentUser ? joinedUserIds.has(currentUser.id) : false;
  const isHost = currentUser ? currentUser.id === ride.hostId : false;
  const seatsLeft = ride.totalSeats - ride.joinedUsers.length;
  const canJoin = Boolean(currentUser) && !isJoined && seatsLeft > 0;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <Card className="border-slate-200">
          <CardHeader className="space-y-4 bg-gradient-to-br from-white via-sky-50 to-emerald-50">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-sky-700">Ride details</p>
                <CardTitle className="mt-2 text-3xl">{ride.destination}</CardTitle>
                <p className="mt-3 text-sm text-slate-600">
                  Hosted by {ride.host.name}
                  {ride.host.gender ? ` • ${genderLabels[ride.host.gender]}` : ""}
                </p>
                {ride.womenOnly ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Women only</p> : null}
              </div>
              <Badge variant={seatsLeft > 0 ? "success" : "warning"}>{seatsLeft > 0 ? `${seatsLeft} seats available` : "Ride full"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  Date
                </div>
                <p className="mt-2 text-base font-semibold text-slate-900">{formatRideDate(ride.departureDate)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  Time
                </div>
                <p className="mt-2 text-base font-semibold text-slate-900">{ride.departureTime}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="h-4 w-4" />
                  Occupancy
                </div>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {ride.joinedUsers.length}/{ride.totalSeats} people
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  Pickup point
                </div>
                <p className="mt-2 text-base font-semibold text-slate-900">{ride.startLocation}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                Notes
              </div>
              <p className="mt-2 text-base font-semibold text-slate-900">{ride.notes || "No extra notes provided."}</p>
            </div>
            {!currentUser ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Log in before joining rides or opening chat.
                <div className="mt-3">
                  <Button asChild variant="outline">
                    <Link href="/login">Go to Login</Link>
                  </Button>
                </div>
              </div>
            ) : !currentUser.gender ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Complete your profile before joining rides so other members can see your gender details.
                <div className="mt-3">
                  <Button asChild variant="outline">
                    <Link href="/complete-profile">Complete Profile</Link>
                  </Button>
                </div>
              </div>
            ) : isJoined ? (
              <div className="space-y-3">
                <Badge variant="secondary" className="w-fit">
                  {isHost ? "You are hosting this ride" : "You are part of this ride"}
                </Badge>
                {isHost ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-500">Hosts stay attached to their own ride unless they delete it.</p>
                    <DeleteRideButton rideId={ride.id} />
                  </div>
                ) : (
                  <LeaveRideButton rideId={ride.id} />
                )}
              </div>
            ) : (
              <JoinRideButton rideId={ride.id} disabled={!canJoin} label={seatsLeft > 0 ? "Join Ride" : "Ride Full"} />
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Passengers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ride.joinedUsers.map((booking, index) => (
              <div key={booking.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{booking.user.name}</p>
                    <p className="text-sm text-slate-500">{booking.user.gender ? genderLabels[booking.user.gender] : "Gender pending"}</p>
                  </div>
                  {booking.userId === ride.hostId ? <Badge variant="secondary">Host</Badge> : null}
                </div>
                {index < ride.joinedUsers.length - 1 ? <Separator className="mt-4" /> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        {currentUser && isJoined ? (
          <ChatPanel
            rideId={ride.id}
            currentUserId={currentUser.id}
            initialMessages={ride.messages.map((message) => ({
              id: message.id,
              text: message.text,
              createdAt: message.createdAt.toISOString(),
              sender: {
                id: message.sender.id,
                name: message.sender.name,
              },
            }))}
          />
        ) : (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Ride chat</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Only ride members can view and send chat messages. Join the ride first to coordinate pickup points and trip details.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

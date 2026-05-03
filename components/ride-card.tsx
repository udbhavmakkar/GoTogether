import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { genderLabels } from "@/lib/constants";
import { formatRideDate } from "@/lib/format";
import { getPublicRideRoute } from "@/lib/ride-options";

type RideCardProps = {
  ride: {
    id: string;
    startLocation: string;
    destination: string;
    departureDate: Date;
    departureTime: string;
    totalSeats: number;
    host: {
      name: string;
      gender: "MALE" | "FEMALE" | "OTHER" | null;
    };
    womenOnly: boolean;
    joinedUsers: Array<{
      id: string;
      user: {
        id: string;
        name: string;
        gender: "MALE" | "FEMALE" | "OTHER" | null;
      };
    }>;
  };
  requireLogin?: boolean;
};

export function RideCard({ ride, requireLogin = false }: RideCardProps) {
  const seatsLeft = ride.totalSeats - ride.joinedUsers.length;
  const isFull = seatsLeft <= 0;
  const publicRoute = getPublicRideRoute(ride.startLocation, ride.destination);
  const rideHref = requireLogin ? `/login?message=ride-access&next=${encodeURIComponent(`/ride/${ride.id}`)}` : `/ride/${ride.id}`;

  return (
    <Card className="overflow-hidden border-slate-200">
      <CardHeader className="space-y-4 bg-gradient-to-br from-white via-sky-50 to-emerald-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-5 w-5 text-sky-600" />
              {publicRoute}
            </CardTitle>
            <p className="mt-2 text-sm text-slate-600">Open the ride to view the exact pickup point inside VIT.</p>
            {requireLogin ? (
              <p className="mt-1 text-sm text-slate-500">Login to view host and passenger details.</p>
            ) : (
              <p className="mt-1 text-sm text-slate-500">
                Hosted by {ride.host.name}
                {ride.host.gender ? ` • ${genderLabels[ride.host.gender]}` : ""}
              </p>
            )}
            {ride.womenOnly ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Women only</p> : null}
          </div>
          <Badge variant={seatsLeft > 0 ? "success" : "warning"}>{seatsLeft > 0 ? `${seatsLeft} seats left` : "Ride full"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 pt-6 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <span>{formatRideDate(ride.departureDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-slate-400" />
          <span>{ride.departureTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <span>
            {ride.joinedUsers.length}/{ride.totalSeats} joined
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Joined riders</p>
          {requireLogin ? (
            <p className="text-sm text-slate-500">Login to see who has joined this ride.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ride.joinedUsers.map((booking) => (
                <span key={booking.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {booking.user.name}
                  {booking.user.gender ? ` • ${genderLabels[booking.user.gender]}` : " • Gender pending"}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isFull ? (
          <Button className="w-full" disabled>
            Ride Full
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={rideHref}>{requireLogin ? "Login to View Ride" : "View Ride"}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRideDate } from "@/lib/format";
import { getPublicRideRoute } from "@/lib/ride-options";

type RideListItem = {
  id: string;
  startLocation: string;
  destination: string;
  departureDate: Date;
  departureTime: string;
  totalSeats: number;
  hostId: string;
  host: {
    name: string;
  };
  joinedUsers: Array<{
    id: string;
    userId: string;
  }>;
};

type RideListProps = {
  title: string;
  description: string;
  rides: RideListItem[];
  currentUserId?: string;
  emptyText: string;
  variant?: "upcoming" | "past";
};

export function RideList({
  title,
  description,
  rides,
  currentUserId,
  emptyText,
  variant = "upcoming",
}: RideListProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-slate-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {rides.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">{emptyText}</p>
        ) : (
          rides.map((ride) => {
            const seatsLeft = ride.totalSeats - ride.joinedUsers.length;
            const isHost = currentUserId === ride.hostId;
            const publicRoute = getPublicRideRoute(ride.startLocation, ride.destination);

            return (
              <div key={ride.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{publicRoute}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatRideDate(ride.departureDate)} at {ride.departureTime}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">Hosted by {ride.host.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isHost ? <Badge variant="secondary">Hosted by you</Badge> : null}
                    {variant === "upcoming" ? (
                      <Badge variant={seatsLeft > 0 ? "success" : "warning"}>
                        {seatsLeft > 0 ? `${seatsLeft} seats left` : "Ride full"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{ride.joinedUsers.length} members</Badge>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href={`/ride/${ride.id}`}>{variant === "past" ? "View Summary" : "Open Ride"}</Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

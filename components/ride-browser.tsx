"use client";

import { useMemo, useState } from "react";

import { RideCard } from "@/components/ride-card";
import { Label } from "@/components/ui/label";
import { ALL_LOCATIONS, getLocationOptionsForSelection, TOTAL_SEAT_OPTIONS } from "@/lib/ride-options";

type RideBrowserProps = {
  currentUserGender?: "MALE" | "FEMALE" | "OTHER" | null;
  rides: Array<{
    id: string;
    startLocation: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    totalSeats: number;
    womenOnly: boolean;
    host: {
      name: string;
      gender: "MALE" | "FEMALE" | "OTHER" | null;
    };
    joinedUsers: Array<{
      id: string;
      user: {
        id: string;
        name: string;
        gender: "MALE" | "FEMALE" | "OTHER" | null;
      };
    }>;
  }>;
};

function getTimeBucket(time: string) {
  const hour = Number(time.split(":")[0]);

  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

export function RideBrowser({ rides, currentUserGender }: RideBrowserProps) {
  const [startLocation, setStartLocation] = useState("all");
  const [destination, setDestination] = useState("all");
  const [timeBucket, setTimeBucket] = useState("all");
  const [womenOnlyFilter, setWomenOnlyFilter] = useState("all");
  const [passengerCount, setPassengerCount] = useState("all");

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      if (ride.womenOnly && currentUserGender !== "FEMALE") {
        return false;
      }

      const matchesStartLocation = startLocation === "all" || ride.startLocation === startLocation;
      const matchesDestination = destination === "all" || ride.destination === destination;

      const matchesTime = timeBucket === "all" || getTimeBucket(ride.departureTime) === timeBucket;
      const matchesWomenOnly = womenOnlyFilter === "all" || (womenOnlyFilter === "women-only" ? ride.womenOnly : !ride.womenOnly);
      const matchesPassengerCount = passengerCount === "all" || String(ride.totalSeats) === passengerCount;

      return matchesStartLocation && matchesDestination && matchesTime && matchesWomenOnly && matchesPassengerCount;
    });
  }, [rides, currentUserGender, startLocation, destination, timeBucket, womenOnlyFilter, passengerCount]);

  const destinationOptions = getLocationOptionsForSelection(startLocation === "all" ? null : startLocation);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="start-location-filter">Pickup point</Label>
          <select
            id="start-location-filter"
            className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={startLocation}
            onChange={(event) => setStartLocation(event.target.value)}
          >
            <option value="all">All pickup points</option>
            {ALL_LOCATIONS.map((pickupPoint) => (
              <option key={pickupPoint} value={pickupPoint}>
                {pickupPoint}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination-filter">Drop location</Label>
          <select
            id="destination-filter"
            className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          >
            <option value="all">All drop locations</option>
            <optgroup label={destinationOptions.primaryLabel}>
              {destinationOptions.primaryOptions.map((dropLocation) => (
                <option key={dropLocation} value={dropLocation}>
                  {dropLocation}
                </option>
              ))}
            </optgroup>
            <optgroup label={destinationOptions.secondaryLabel}>
              {destinationOptions.secondaryOptions.map((dropLocation) => (
                <option key={dropLocation} value={dropLocation}>
                  {dropLocation}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="time-filter">Filter by departure time</Label>
          <select
            id="time-filter"
            className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={timeBucket}
            onChange={(event) => setTimeBucket(event.target.value)}
          >
            <option value="all">All times</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
        </div>
        {currentUserGender === "FEMALE" ? (
          <div className="space-y-2">
            <Label htmlFor="women-only-filter">Ride type</Label>
            <select
              id="women-only-filter"
              className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={womenOnlyFilter}
              onChange={(event) => setWomenOnlyFilter(event.target.value)}
            >
              <option value="all">All rides</option>
              <option value="regular">Regular rides</option>
              <option value="women-only">Women-only rides</option>
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Ride type</Label>
            <div className="min-h-11 rounded-xl border border-input bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-500">
              Women-only rides are shown only to women users.
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="passenger-count-filter">Sharing size</Label>
          <select
            id="passenger-count-filter"
            className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={passengerCount}
            onChange={(event) => setPassengerCount(event.target.value)}
          >
            <option value="all">Any size</option>
            {TOTAL_SEAT_OPTIONS.map((seatCount) => (
              <option key={seatCount} value={String(seatCount)}>
                {seatCount} people
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRides.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
          No rides match the current filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredRides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={{
                ...ride,
                departureDate: new Date(ride.departureDate),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

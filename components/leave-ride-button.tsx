"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { leaveRide } from "@/api/client";
import { Button } from "@/components/ui/button";

type LeaveRideButtonProps = {
  rideId: string;
};

export function LeaveRideButton({ rideId }: LeaveRideButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleLeave() {
    setError("");

    startTransition(async () => {
      try {
        await leaveRide(rideId);
        router.push("/my-rides");
        router.refresh();
      } catch (leaveError) {
        setError(leaveError instanceof Error ? leaveError.message : "Unable to leave ride.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <Button type="button" variant="outline" size="lg" className="w-full" disabled={isPending} onClick={handleLeave}>
        {isPending ? "Leaving..." : "Exit Ride"}
      </Button>
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

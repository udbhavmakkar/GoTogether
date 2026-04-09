"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { joinRide } from "@/api/client";
import { Button } from "@/components/ui/button";

type JoinRideButtonProps = {
  rideId: string;
  disabled?: boolean;
  label: string;
};

export function JoinRideButton({ rideId, disabled, label }: JoinRideButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleJoin() {
    setError("");

    startTransition(async () => {
      try {
        await joinRide(rideId);
        router.refresh();
      } catch (joinError) {
        setError(joinError instanceof Error ? joinError.message : "Unable to join ride.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <Button size="lg" className="w-full" disabled={disabled || isPending} onClick={handleJoin}>
        {isPending ? "Joining..." : label}
      </Button>
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

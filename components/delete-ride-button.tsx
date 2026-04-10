"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteRide } from "@/api/client";
import { Button } from "@/components/ui/button";

type DeleteRideButtonProps = {
  rideId: string;
};

export function DeleteRideButton({ rideId }: DeleteRideButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm("Delete this ride for everyone? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        await deleteRide(rideId);
        router.push("/my-rides");
        router.refresh();
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : "Unable to delete ride.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <Button type="button" variant="destructive" size="lg" className="w-full" disabled={isPending} onClick={handleDelete}>
        {isPending ? "Deleting..." : "Delete Ride"}
      </Button>
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

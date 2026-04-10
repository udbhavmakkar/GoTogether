"use client";

import { type FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createRide } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ALL_LOCATIONS, getLocationOptionsForSelection, TOTAL_SEAT_OPTIONS } from "@/lib/ride-options";

type CreateRideFormProps = {
  currentUserGender: "MALE" | "FEMALE" | "OTHER";
};

export function CreateRideForm({ currentUserGender }: CreateRideFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    startLocation: "",
    destination: "",
    date: "",
    time: "",
    totalSeats: "4",
    womenOnly: false,
    notes: "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  const destinationOptions = getLocationOptionsForSelection(form.startLocation);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const result = await createRide({
          startLocation: form.startLocation,
          destination: form.destination,
          date: form.date,
          time: form.time,
          totalSeats: Number(form.totalSeats),
          womenOnly: form.womenOnly,
          notes: form.notes,
        });

        router.push(`/ride/${result.rideId}`);
        router.refresh();
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Unable to create ride.");
      }
    });
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Create a new ride</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="startLocation">Pickup point</Label>
            <select
              id="startLocation"
              className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
              value={form.startLocation}
              onChange={(event) => updateField("startLocation", event.target.value)}
            >
              <option value="">Select pickup point</option>
              {ALL_LOCATIONS.map((pickupPoint) => (
                <option key={pickupPoint} value={pickupPoint}>
                  {pickupPoint}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Drop location</Label>
            <select
              id="destination"
              className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
              value={form.destination}
              onChange={(event) => updateField("destination", event.target.value)}
            >
              <option value="">Select drop location</option>
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
            <p className="text-xs text-slate-500">Drop suggestions adapt to your pickup point, but you can still choose any listed location.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required value={form.date} onChange={(event) => updateField("date", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" required value={form.time} onChange={(event) => updateField("time", event.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seats">Total people</Label>
            <select
              id="seats"
              className="flex h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
              value={form.totalSeats}
              onChange={(event) => updateField("totalSeats", event.target.value)}
            >
              {TOTAL_SEAT_OPTIONS.map((seatCount) => (
                <option key={seatCount} value={String(seatCount)}>
                  {seatCount}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">Include yourself in this count because the host is automatically joined.</p>
          </div>
          {currentUserGender === "FEMALE" ? (
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300"
                checked={form.womenOnly}
                onChange={(event) => setForm((current) => ({ ...current, womenOnly: event.target.checked }))}
              />
              <span>
                <span className="block font-semibold text-slate-900">Restrict this ride to women only</span>
                <span className="mt-1 block text-xs text-slate-500">
                  Women-only rides are visible and joinable only to women users.
                </span>
              </span>
            </label>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Pickup point, luggage space, or any coordination details."
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </div>
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Creating..." : "Create Ride"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { type FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateProfileGender } from "@/api/client";
import { genderOptions } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function CompleteProfileForm() {
  const router = useRouter();
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await updateProfileGender(gender);
        router.push("/");
        router.refresh();
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Unable to update profile.");
      }
    });
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Complete your profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Label>Select gender</Label>
            <div className="grid gap-3 md:grid-cols-3">
              {genderOptions.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-4 text-sm font-medium transition ${
                    gender === option.value ? "border-sky-600 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={gender === option.value}
                    onChange={(event) => setGender(event.target.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500">Gender is shown in ride memberships so students can make safer decisions before joining a ride.</p>
          </div>
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save and Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

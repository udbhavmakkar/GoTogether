"use client";

import { signOut } from "next-auth/react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileManagerProps = {
  currentUser: {
    id: string;
    name: string;
    email: string;
  };
};

export function ProfileManager({ currentUser }: ProfileManagerProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    setError("");

    startTransition(async () => {
      try {
        await signOut({ redirect: false });
        router.push("/login");
        router.refresh();
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Unable to log out.");
      }
    });
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-lg font-semibold text-slate-900">{currentUser.name}</p>
          <p className="mt-1 text-sm text-slate-500">{currentUser.email}</p>
          <p className="mt-3 text-sm text-slate-600">You are signed in with your GoTogether account.</p>
        </div>
        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
        <Button type="button" variant="outline" onClick={handleLogout} disabled={isPending}>
          {isPending ? "Logging out..." : "Log Out"}
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GoogleAuthCardProps = {
  mode: "login" | "register";
};

export function GoogleAuthCard({ mode }: GoogleAuthCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Login" : "Register"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">
          Continue with Google using your <code>@vitstudent.ac.in</code> account. Your name and email are taken directly from Google.
        </p>
        <Button
          type="button"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/complete-profile",
            })
          }
        >
          {mode === "login" ? "Sign in with Google" : "Continue with Google"}
        </Button>
      </CardContent>
    </Card>
  );
}

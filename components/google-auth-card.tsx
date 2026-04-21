"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GoogleAuthCardProps = {
  mode: "login" | "register";
  callbackUrl?: string;
};

export function GoogleAuthCard({ mode, callbackUrl = "/" }: GoogleAuthCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Login" : "Register"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">
          Continue with Google using your VIT email ID. Student and alumni accounts are supported, and your name and email are taken directly from Google.
        </p>
        <p className="text-xs leading-5 text-slate-500">
          If your phone defaults to a personal Gmail account, tap to choose another account and select or add your VIT Google account before continuing.
        </p>
        <Button
          type="button"
          onClick={() =>
            signIn(
              "google",
              {
                callbackUrl,
              },
              {
                prompt: "select_account",
              },
            )
          }
        >
          {mode === "login" ? "Sign in with Google" : "Continue with Google"}
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProviderFollowUpFeedbackForm({ token }: { token: string }) {
  const [agreedFare, setAgreedFare] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/provider-follow-ups/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          agreedFare: agreedFare ? Number(agreedFare) : null,
          feedback: feedback || null,
        }),
      });
      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to save your feedback.");
      }

      setIsSaved(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save your feedback.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSaved) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Your fare and feedback have been saved. Thank you.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-slate-200 pt-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Optional booking details</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          This helps us compare listed prices with the final fare. You can leave both fields empty.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agreed-fare">Final agreed fare (INR)</Label>
        <Input
          id="agreed-fare"
          type="number"
          min="0"
          max="100000"
          step="1"
          inputMode="numeric"
          placeholder="For example, 2100"
          value={agreedFare}
          onChange={(event) => setAgreedFare(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider-feedback">Short provider feedback</Label>
        <Textarea
          id="provider-feedback"
          maxLength={500}
          placeholder="How was your experience?"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
        />
        <p className="text-right text-xs text-slate-400">{feedback.length}/500</p>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Submit optional details"}
      </Button>
    </form>
  );
}

import { NextResponse } from "next/server";

import { saveProviderFollowUpFeedback } from "@/lib/provider-follow-ups";

type FollowUpFeedbackPayload = {
  token?: string;
  agreedFare?: number | null;
  feedback?: string | null;
};

export async function POST(request: Request) {
  let payload: FollowUpFeedbackPayload;

  try {
    payload = (await request.json()) as FollowUpFeedbackPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!payload.token || payload.token.length < 32) {
    return NextResponse.json({ error: "This response link is invalid." }, { status: 400 });
  }

  const agreedFare = payload.agreedFare ?? null;

  if (
    agreedFare !== null &&
    (!Number.isInteger(agreedFare) || agreedFare < 0 || agreedFare > 100_000)
  ) {
    return NextResponse.json({ error: "Enter a valid fare in rupees." }, { status: 400 });
  }

  const feedback = payload.feedback?.trim() || null;

  if (feedback && feedback.length > 500) {
    return NextResponse.json({ error: "Feedback must be 500 characters or less." }, { status: 400 });
  }

  const followUp = await saveProviderFollowUpFeedback({
    token: payload.token,
    agreedFare,
    feedback,
  });

  if (!followUp) {
    return NextResponse.json({ error: "This response link is invalid or is not a booked ride." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

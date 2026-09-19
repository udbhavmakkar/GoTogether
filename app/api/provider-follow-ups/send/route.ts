import { NextResponse } from "next/server";

import { sendProviderFollowUp } from "@/lib/provider-follow-ups";

type SendFollowUpPayload = {
  followUpId?: string;
};

export async function POST(request: Request) {
  const jobSecret = process.env.FOLLOW_UP_JOB_SECRET;
  const authorization = request.headers.get("authorization");

  if (!jobSecret || authorization !== `Bearer ${jobSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: SendFollowUpPayload;

  try {
    payload = (await request.json()) as SendFollowUpPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!payload.followUpId) {
    return NextResponse.json({ error: "Follow-up ID is required." }, { status: 400 });
  }

  try {
    const result = await sendProviderFollowUp(payload.followUpId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Unable to send provider follow-up", error);
    return NextResponse.json({ error: "Unable to send provider follow-up." }, { status: 500 });
  }
}

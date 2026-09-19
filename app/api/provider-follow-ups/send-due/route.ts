import { NextResponse } from "next/server";

import { sendDueProviderFollowUps } from "@/lib/provider-follow-ups";

export async function POST(request: Request) {
  const jobSecret = process.env.FOLLOW_UP_JOB_SECRET;
  const authorization = request.headers.get("authorization");

  if (!jobSecret || authorization !== `Bearer ${jobSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sendDueProviderFollowUps();
  return NextResponse.json({ success: true, ...result });
}

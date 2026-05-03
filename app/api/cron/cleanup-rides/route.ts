import { NextResponse } from "next/server";

import { deleteExpiredRides } from "@/lib/rides";

function isAuthorizedCronRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  return request.headers.get("user-agent") === "vercel-cron/1.0";
}

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletedCount = await deleteExpiredRides();

  return NextResponse.json({
    success: true,
    deletedCount,
  });
}

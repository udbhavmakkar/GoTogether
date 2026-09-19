import { ProviderFollowUpResponse } from "@prisma/client";
import { NextResponse } from "next/server";

import { recordProviderFollowUpResponse } from "@/lib/provider-follow-ups";

const ALLOWED_RESPONSES = new Set<ProviderFollowUpResponse>([
  ProviderFollowUpResponse.BOOKED,
  ProviderFollowUpResponse.NOT_BOOKED,
  ProviderFollowUpResponse.DECIDING,
]);

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token") || "";
  const rawResponse = requestUrl.searchParams.get("response") || "";
  const confirmationUrl = new URL("/provider-follow-up/thanks", requestUrl.origin);

  if (token.length < 32 || !ALLOWED_RESPONSES.has(rawResponse as ProviderFollowUpResponse)) {
    confirmationUrl.searchParams.set("status", "invalid");
    return NextResponse.redirect(confirmationUrl, 303);
  }

  const followUp = await recordProviderFollowUpResponse(token, rawResponse as ProviderFollowUpResponse);

  if (!followUp?.response) {
    confirmationUrl.searchParams.set("status", "invalid");
    return NextResponse.redirect(confirmationUrl, 303);
  }

  confirmationUrl.searchParams.set("status", "recorded");
  confirmationUrl.searchParams.set("response", followUp.response);

  if (followUp.response === ProviderFollowUpResponse.BOOKED) {
    confirmationUrl.searchParams.set("token", token);
  }

  return NextResponse.redirect(confirmationUrl, 303);
}

import { ProviderFollowUpResponse } from "@prisma/client";
import { NextResponse } from "next/server";

import { sendProviderFollowUpResponseNotificationEmail } from "@/lib/email";
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

  const result = await recordProviderFollowUpResponse(token, rawResponse as ProviderFollowUpResponse);

  if (!result) {
    confirmationUrl.searchParams.set("status", "invalid");
    return NextResponse.redirect(confirmationUrl, 303);
  }

  const { followUp, recorded } = result;
  const recordedResponse = followUp.response;

  if (!recordedResponse) {
    confirmationUrl.searchParams.set("status", "invalid");
    return NextResponse.redirect(confirmationUrl, 303);
  }

  if (recorded && followUp.respondedAt) {
    try {
      await sendProviderFollowUpResponseNotificationEmail({
        customerName: followUp.user.name,
        customerEmail: followUp.user.email,
        providerName: followUp.providerName,
        response: recordedResponse,
        contactedAt: followUp.contactedAt,
        respondedAt: followUp.respondedAt,
        followUpId: followUp.id,
      });
    } catch (error) {
      console.error("Unable to send provider booking response notification", error);
    }
  }

  confirmationUrl.searchParams.set("status", "recorded");
  confirmationUrl.searchParams.set("response", recordedResponse);

  if (recordedResponse === ProviderFollowUpResponse.BOOKED) {
    confirmationUrl.searchParams.set("token", token);
  }

  return NextResponse.redirect(confirmationUrl, 303);
}

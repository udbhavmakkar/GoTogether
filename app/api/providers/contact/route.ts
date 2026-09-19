import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { sendProviderContactNotificationEmail } from "@/lib/email";
import { createProviderContactFollowUp, sendProviderFollowUp } from "@/lib/provider-follow-ups";
import { getProviderById } from "@/lib/providers";

type ProviderContactPayload = {
  providerId?: string;
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Please login before contacting a provider." }, { status: 401 });
  }

  let payload: ProviderContactPayload;

  try {
    payload = (await request.json()) as ProviderContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!payload.providerId) {
    return NextResponse.json({ error: "Provider is required." }, { status: 400 });
  }

  const provider = getProviderById(payload.providerId);

  if (!provider) {
    return NextResponse.json({ error: "Provider not found." }, { status: 404 });
  }

  const { followUp, created } = await createProviderContactFollowUp({
    providerId: provider.id,
    providerName: provider.name,
    userId: currentUser.id,
  });
  const [supportNotificationResult, customerFollowUpResult] = await Promise.allSettled([
    sendProviderContactNotificationEmail({
      providerName: provider.name,
      providerPhone: provider.phone,
      contactedAt: followUp.lastContactedAt,
      userName: currentUser.name,
      userEmail: currentUser.email,
      followUpId: followUp.id,
    }),
    sendProviderFollowUp(followUp.id, currentUser.name),
  ]);

  if (supportNotificationResult.status === "rejected") {
    console.error("Unable to send provider contact notification", supportNotificationResult.reason);
  }

  if (customerFollowUpResult.status === "rejected") {
    console.error("Unable to send customer booking confirmation", customerFollowUpResult.reason);
  }

  return NextResponse.json({
    success: true,
    followUpId: followUp.id,
    duplicate: !created,
    confirmationEmailSent:
      customerFollowUpResult.status === "fulfilled" &&
      (customerFollowUpResult.value.sent || customerFollowUpResult.value.reason === "ALREADY_SENT"),
  });
}

import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { sendProviderContactNotificationEmail } from "@/lib/email";
import { getProviderById } from "@/lib/providers";

type ProviderContactPayload = {
  providerId?: string;
};

export async function POST(request: Request) {
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

  const currentUser = await getCurrentUser();

  await sendProviderContactNotificationEmail({
    providerName: provider.name,
    providerPhone: provider.phone,
    contactedAt: new Date(),
    userName: currentUser?.name ?? null,
    userEmail: currentUser?.email ?? null,
  });

  return NextResponse.json({ success: true });
}

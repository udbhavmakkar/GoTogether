import { createHash, randomBytes } from "node:crypto";

import { Prisma, ProviderFollowUpResponse } from "@prisma/client";

import { prisma } from "@/lib/db";
import { sendProviderFollowUpEmail } from "@/lib/email";

const DEFAULT_FOLLOW_UP_DELAY_HOURS = 3;
const EMAIL_CLAIM_TIMEOUT_MS = 15 * 60 * 1000;

function createResponseToken() {
  return randomBytes(32).toString("base64url");
}

export function hashResponseToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getIndiaDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getFollowUpDelayHours() {
  const configuredDelay = Number(process.env.PROVIDER_FOLLOW_UP_DELAY_HOURS || DEFAULT_FOLLOW_UP_DELAY_HOURS);

  if (!Number.isFinite(configuredDelay)) {
    return DEFAULT_FOLLOW_UP_DELAY_HOURS;
  }

  return Math.min(4, Math.max(2, configuredDelay));
}

export async function createProviderContactFollowUp(input: {
  providerId: string;
  providerName: string;
  userId: string;
}) {
  const contactedAt = new Date();
  const contactDateKey = getIndiaDateKey(contactedAt);
  const uniqueWhere = {
    userId_providerId_contactDateKey: {
      userId: input.userId,
      providerId: input.providerId,
      contactDateKey,
    },
  } as const;
  const existing = await prisma.providerContactFollowUp.findUnique({ where: uniqueWhere });

  if (existing) {
    const followUp = await prisma.providerContactFollowUp.update({
      where: { id: existing.id },
      data: {
        lastContactedAt: contactedAt,
        contactCount: { increment: 1 },
      },
    });
    return { followUp, created: false };
  }

  const followUpDueAt = new Date(contactedAt.getTime() + getFollowUpDelayHours() * 60 * 60 * 1000);

  try {
    const followUp = await prisma.providerContactFollowUp.create({
      data: {
        providerId: input.providerId,
        providerName: input.providerName,
        userId: input.userId,
        contactDateKey,
        contactedAt,
        lastContactedAt: contactedAt,
        followUpDueAt,
        responseTokenHash: hashResponseToken(createResponseToken()),
      },
    });

    return { followUp, created: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const duplicate = await prisma.providerContactFollowUp.findUniqueOrThrow({ where: uniqueWhere });
      const followUp = await prisma.providerContactFollowUp.update({
        where: { id: duplicate.id },
        data: {
          lastContactedAt: contactedAt,
          contactCount: { increment: 1 },
        },
      });
      return { followUp, created: false };
    }

    throw error;
  }
}

export async function sendProviderFollowUp(followUpId: string, customerName?: string | null) {
  const now = new Date();
  const staleClaimBefore = new Date(now.getTime() - EMAIL_CLAIM_TIMEOUT_MS);
  const responseToken = createResponseToken();
  const responseTokenHash = hashResponseToken(responseToken);
  const claimed = await prisma.providerContactFollowUp.updateMany({
    where: {
      id: followUpId,
      emailSentAt: null,
      OR: [{ emailClaimedAt: null }, { emailClaimedAt: { lt: staleClaimBefore } }],
    },
    data: {
      emailClaimedAt: now,
      responseTokenHash,
    },
  });

  if (claimed.count === 0) {
    const existing = await prisma.providerContactFollowUp.findUnique({
      where: { id: followUpId },
      select: { emailSentAt: true },
    });

    return { sent: false as const, reason: existing?.emailSentAt ? "ALREADY_SENT" : "ALREADY_PROCESSING" };
  }

  const followUp = await prisma.providerContactFollowUp.findUniqueOrThrow({
    where: { id: followUpId },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  try {
    await sendProviderFollowUpEmail({
      customerEmail: followUp.user.email,
      customerName,
      providerName: followUp.providerName,
      contactedAt: followUp.contactedAt,
      followUpId: followUp.id,
      responseToken,
    });

    await prisma.providerContactFollowUp.update({
      where: { id: followUp.id },
      data: {
        emailSentAt: new Date(),
        emailClaimedAt: null,
      },
    });

    return { sent: true as const };
  } catch (error) {
    await prisma.providerContactFollowUp.updateMany({
      where: {
        id: followUp.id,
        emailSentAt: null,
      },
      data: { emailClaimedAt: null },
    });
    throw error;
  }
}

export async function sendDueProviderFollowUps(limit = 25) {
  const dueFollowUps = await prisma.providerContactFollowUp.findMany({
    where: {
      followUpDueAt: { lte: new Date() },
      emailSentAt: null,
    },
    select: { id: true },
    orderBy: { followUpDueAt: "asc" },
    take: Math.min(100, Math.max(1, limit)),
  });
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const followUp of dueFollowUps) {
    try {
      const result = await sendProviderFollowUp(followUp.id);

      if (result.sent) {
        sent += 1;
      } else {
        skipped += 1;
      }
    } catch (error) {
      failed += 1;
      console.error(`Unable to send provider follow-up ${followUp.id}`, error);
    }
  }

  return {
    processed: dueFollowUps.length,
    sent,
    skipped,
    failed,
  };
}

export async function recordProviderFollowUpResponse(token: string, response: ProviderFollowUpResponse) {
  const responseTokenHash = hashResponseToken(token);
  const existing = await prisma.providerContactFollowUp.findUnique({ where: { responseTokenHash } });

  if (!existing) {
    return null;
  }

  if (!existing.response) {
    await prisma.providerContactFollowUp.updateMany({
      where: {
        id: existing.id,
        response: null,
      },
      data: {
        response,
        respondedAt: new Date(),
      },
    });
  }

  return prisma.providerContactFollowUp.findUnique({ where: { id: existing.id } });
}

export async function saveProviderFollowUpFeedback(input: {
  token: string;
  agreedFare: number | null;
  feedback: string | null;
}) {
  const responseTokenHash = hashResponseToken(input.token);
  const followUp = await prisma.providerContactFollowUp.findUnique({ where: { responseTokenHash } });

  if (!followUp || followUp.response !== "BOOKED") {
    return null;
  }

  return prisma.providerContactFollowUp.update({
    where: { id: followUp.id },
    data: {
      agreedFare: input.agreedFare,
      feedback: input.feedback,
    },
  });
}

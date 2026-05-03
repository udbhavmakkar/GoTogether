import type { Prisma, NotificationType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getPublicRideRoute } from "@/lib/ride-options";

function getNotificationMessage(type: NotificationType, actorName: string, routeLabel: string) {
  if (type === "RIDE_JOINED") {
    return {
      title: "New rider joined",
      body: `${actorName} joined your ride for ${routeLabel}.`,
    };
  }

  return {
    title: "New chat",
    body: `${actorName} sent a new message in ${routeLabel}.`,
  };
}

export async function createNotification(
  tx: Prisma.TransactionClient,
  input: {
    userId: string;
    rideId?: string;
    type: NotificationType;
    actorName: string;
    routeLabel: string;
  },
) {
  const message = getNotificationMessage(input.type, input.actorName, input.routeLabel);

  return tx.notification.create({
    data: {
      userId: input.userId,
      rideId: input.rideId ?? null,
      type: input.type,
      title: message.title,
      body: message.body,
    },
  });
}

export async function getNotificationsForUser(userId: string) {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    }),
    prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),
  ]);

  return {
    notifications,
    unreadCount,
  };
}

export async function markNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}

export function getRideNotificationRoute(startLocation: string, destination: string) {
  return getPublicRideRoute(startLocation, destination);
}

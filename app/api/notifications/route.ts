import type { Notification } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireCurrentUser } from "@/lib/auth";
import { getNotificationsForUser, markNotificationsRead } from "@/lib/notifications";

export async function GET() {
  try {
    const currentUser = await requireCurrentUser();
    const result = await getNotificationsForUser(currentUser.id);

    return NextResponse.json({
      unreadCount: result.unreadCount,
      notifications: result.notifications.map((notification: Notification) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        rideId: notification.rideId,
        isRead: notification.isRead,
        createdAt: notification.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Please log in or register first.") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ error: "Unable to load notifications." }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const currentUser = await requireCurrentUser();
    await markNotificationsRead(currentUser.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Please log in or register first.") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ error: "Unable to update notifications." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendRideChatNotificationEmail } from "@/lib/email";
import { createNotification, getRideNotificationRoute } from "@/lib/notifications";
import { validateMessage } from "@/lib/validators";

async function ensureMembership(rideId: string, userId: string) {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    select: { id: true },
  });

  if (!ride) {
    throw new Error("RIDE_NOT_FOUND");
  }

  const membership = await prisma.booking.findUnique({
    where: {
      userId_rideId: {
        userId,
        rideId,
      },
    },
  });

  return Boolean(membership);
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireCurrentUser();
    const { id } = await params;

    const isMember = await ensureMembership(id, currentUser.id);
    if (!isMember) {
      return NextResponse.json({ error: "Only ride members can access chat." }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { rideId: id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      messages: messages.map((message) => ({
        id: message.id,
        text: message.text,
        createdAt: message.createdAt.toISOString(),
        sender: message.sender,
      })),
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Please log in or register first.") {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      if (error.message === "RIDE_NOT_FOUND") {
        return NextResponse.json({ error: "Ride not found." }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Unable to load messages." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireCurrentUser();
    const { id } = await params;
    const body = (await request.json()) as { text?: string };

    const validationError = validateMessage(body.text);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const isMember = await ensureMembership(id, currentUser.id);
    if (!isMember) {
      return NextResponse.json({ error: "Only ride members can send chat messages." }, { status: 403 });
    }

    let recipientEmails: string[] = [];
    let routeLabel = "";
    let departureDate: Date | null = null;
    let departureTime = "";

    await prisma.$transaction(async (tx) => {
      const ride = await tx.ride.findUnique({
        where: { id },
        select: {
          id: true,
          startLocation: true,
          destination: true,
          departureDate: true,
          departureTime: true,
          joinedUsers: {
            select: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!ride) {
        throw new Error("RIDE_NOT_FOUND");
      }

      await tx.message.create({
        data: {
          rideId: id,
          senderId: currentUser.id,
          text: body.text!.trim(),
        },
      });

      const recipientIds = Array.from(
        new Set(ride.joinedUsers.map((booking) => booking.user.id).filter((userId) => userId !== currentUser.id)),
      );

      recipientEmails = Array.from(
        new Set(ride.joinedUsers.map((booking) => booking.user.email).filter((email) => email !== currentUser.email)),
      );

      routeLabel = getRideNotificationRoute(ride.startLocation, ride.destination);
      departureDate = ride.departureDate;
      departureTime = ride.departureTime;

      await Promise.all(
        recipientIds.map((userId) =>
          createNotification(tx, {
            userId,
            rideId: ride.id,
            type: "CHAT_MESSAGE",
            actorName: currentUser.name,
            routeLabel,
          }),
        ),
      );
    });

    if (recipientEmails.length > 0 && departureDate) {
      void sendRideChatNotificationEmail({
        bccRecipients: recipientEmails,
        senderName: currentUser.name,
        routeLabel,
        departureDate,
        departureTime,
      }).catch(() => {
        // Email delivery is best-effort and must not break chat.
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Please log in or register first.") {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      if (error.message === "RIDE_NOT_FOUND") {
        return NextResponse.json({ error: "Ride not found." }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Unable to send message." }, { status: 500 });
  }
}

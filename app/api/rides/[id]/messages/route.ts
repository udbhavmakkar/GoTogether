import { NextResponse } from "next/server";

import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
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

    await prisma.message.create({
      data: {
        rideId: id,
        senderId: currentUser.id,
        text: body.text!.trim(),
      },
    });

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

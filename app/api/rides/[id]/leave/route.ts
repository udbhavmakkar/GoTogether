import { NextResponse } from "next/server";

import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireCurrentUser();
    const { id } = await params;

    await prisma.$transaction(async (tx) => {
      const ride = await tx.ride.findUnique({
        where: { id },
        include: {
          joinedUsers: true,
        },
      });

      if (!ride) {
        throw new Error("RIDE_NOT_FOUND");
      }

      if (ride.hostId === currentUser.id) {
        throw new Error("HOST_CANNOT_LEAVE");
      }

      const booking = ride.joinedUsers.find((entry) => entry.userId === currentUser.id);

      if (!booking) {
        throw new Error("NOT_IN_RIDE");
      }

      await tx.booking.delete({
        where: {
          id: booking.id,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Please log in or register first.") {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      if (error.message === "RIDE_NOT_FOUND") {
        return NextResponse.json({ error: "Ride not found." }, { status: 404 });
      }

      if (error.message === "HOST_CANNOT_LEAVE") {
        return NextResponse.json({ error: "Hosts cannot exit their own ride. Keep hosting or remove the ride separately." }, { status: 409 });
      }

      if (error.message === "NOT_IN_RIDE") {
        return NextResponse.json({ error: "You are not part of this ride." }, { status: 409 });
      }
    }

    return NextResponse.json({ error: "Unable to leave ride." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasRideTimeConflict } from "@/lib/ride-time";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireCurrentUser();

    if (!currentUser.gender) {
      return NextResponse.json({ error: "Complete your profile before joining a ride." }, { status: 403 });
    }

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

      if (ride.womenOnly && currentUser.gender !== "FEMALE") {
        throw new Error("WOMEN_ONLY_RIDE");
      }

      const alreadyJoined = ride.joinedUsers.some((booking) => booking.userId === currentUser.id);

      if (alreadyJoined) {
        throw new Error("ALREADY_JOINED");
      }

      if (ride.joinedUsers.length >= ride.totalSeats) {
        throw new Error("RIDE_FULL");
      }

      const conflictingRides = await tx.ride.findMany({
        where: {
          id: {
            not: ride.id,
          },
          OR: [
            {
              hostId: currentUser.id,
            },
            {
              joinedUsers: {
                some: {
                  userId: currentUser.id,
                },
              },
            },
          ],
        },
        select: {
          departureDate: true,
          departureTime: true,
        },
      });

      if (hasRideTimeConflict(ride.departureDate, ride.departureTime, conflictingRides)) {
        throw new Error("RIDE_TIME_CONFLICT");
      }

      await tx.booking.create({
        data: {
          rideId: ride.id,
          userId: currentUser.id,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Please log in or register first.") {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      if (error.message === "ALREADY_JOINED") {
        return NextResponse.json({ error: "You have already joined this ride." }, { status: 409 });
      }

      if (error.message === "RIDE_FULL") {
        return NextResponse.json({ error: "This ride is already full." }, { status: 409 });
      }

      if (error.message === "RIDE_NOT_FOUND") {
        return NextResponse.json({ error: "Ride not found." }, { status: 404 });
      }

      if (error.message === "WOMEN_ONLY_RIDE") {
        return NextResponse.json({ error: "This ride is restricted to women only." }, { status: 403 });
      }

      if (error.message === "RIDE_TIME_CONFLICT") {
        return NextResponse.json({ error: "You already have another ride around the same time." }, { status: 409 });
      }
    }

    return NextResponse.json({ error: "Unable to join ride." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateRideInput } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();

    if (!currentUser.gender) {
      return NextResponse.json({ error: "Complete your profile before creating a ride." }, { status: 403 });
    }

    const body = (await request.json()) as {
      startLocation?: string;
      destination?: string;
      date?: string;
      time?: string;
      totalSeats?: number;
      womenOnly?: boolean;
      notes?: string;
      price?: number | null;
    };

    const validationError = validateRideInput(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const departureDate = new Date(`${body.date}T00:00:00`);

    if (Number.isNaN(departureDate.getTime())) {
      return NextResponse.json({ error: "Please provide a valid departure date." }, { status: 400 });
    }

    if (body.womenOnly && currentUser.gender !== "FEMALE") {
      return NextResponse.json({ error: "Only women can create women-only rides." }, { status: 403 });
    }

    const ride = await prisma.$transaction(async (tx) => {
      const createdRide = await tx.ride.create({
        data: {
          hostId: currentUser.id,
          startLocation: body.startLocation!.trim(),
          destination: body.destination!.trim(),
          departureDate,
          departureTime: body.time!,
          totalSeats: body.totalSeats!,
          womenOnly: Boolean(body.womenOnly),
          notes: body.notes?.trim() || null,
          price: body.price ?? null,
        },
      });

      await tx.booking.create({
        data: {
          rideId: createdRide.id,
          userId: currentUser.id,
        },
      });

      return createdRide;
    });

    return NextResponse.json({ rideId: ride.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Please log in or register first.") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ error: "Unable to create ride." }, { status: 500 });
  }
}

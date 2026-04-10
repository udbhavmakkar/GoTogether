import { NextResponse } from "next/server";

import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireCurrentUser();
    const { id } = await params;

    const ride = await prisma.ride.findUnique({
      where: { id },
      select: {
        id: true,
        hostId: true,
      },
    });

    if (!ride) {
      return NextResponse.json({ error: "Ride not found." }, { status: 404 });
    }

    if (ride.hostId !== currentUser.id) {
      return NextResponse.json({ error: "Only the host can delete this ride." }, { status: 403 });
    }

    await prisma.ride.delete({
      where: { id: ride.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Please log in or register first.") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ error: "Unable to delete ride." }, { status: 500 });
  }
}

import { prisma } from "@/lib/db";
import { isUpcomingRide } from "@/lib/ride-time";

const rideInclude = {
  host: true,
  joinedUsers: {
    include: {
      user: true,
    },
  },
} as const;

export async function getRideById(id: string) {
  return prisma.ride.findUnique({
    where: { id },
    include: {
      host: true,
      joinedUsers: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      messages: {
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function listRides() {
  return prisma.ride.findMany({
    include: rideInclude,
    orderBy: [
      { departureDate: "asc" },
      { departureTime: "asc" },
      { createdAt: "desc" },
    ],
  });
}

export async function getUserRideCollections(userId: string, now: Date) {
  const [hostedRides, joinedRides] = await Promise.all([
    prisma.ride.findMany({
      where: {
        hostId: userId,
      },
      include: rideInclude,
      orderBy: [{ departureDate: "asc" }, { departureTime: "asc" }],
    }),
    prisma.ride.findMany({
      where: {
        hostId: {
          not: userId,
        },
        joinedUsers: {
          some: {
            userId,
          },
        },
      },
      include: rideInclude,
      orderBy: [{ departureDate: "asc" }, { departureTime: "asc" }],
    }),
  ]);

  const upcomingHosted = hostedRides.filter((ride) => isUpcomingRide(ride.departureDate, ride.departureTime, now));
  const pastHosted = hostedRides.filter((ride) => !isUpcomingRide(ride.departureDate, ride.departureTime, now));
  const upcomingJoined = joinedRides.filter((ride) => isUpcomingRide(ride.departureDate, ride.departureTime, now));
  const pastJoined = joinedRides.filter((ride) => !isUpcomingRide(ride.departureDate, ride.departureTime, now));

  return {
    upcomingHosted,
    upcomingJoined,
    pastHosted,
    pastJoined,
  };
}

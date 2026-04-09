import { prisma } from "@/lib/db";

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

export async function getUserRideCollections(userId: string, today: Date) {
  const [upcomingHosted, upcomingJoined, pastHosted, pastJoined] = await Promise.all([
    prisma.ride.findMany({
      where: {
        hostId: userId,
        departureDate: {
          gte: today,
        },
      },
      include: rideInclude,
      orderBy: [{ departureDate: "asc" }, { departureTime: "asc" }],
    }),
    prisma.ride.findMany({
      where: {
        departureDate: {
          gte: today,
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
    prisma.ride.findMany({
      where: {
        hostId: userId,
        departureDate: {
          lt: today,
        },
      },
      include: rideInclude,
      orderBy: [{ departureDate: "desc" }, { departureTime: "desc" }],
    }),
    prisma.ride.findMany({
      where: {
        departureDate: {
          lt: today,
        },
        joinedUsers: {
          some: {
            userId,
          },
        },
      },
      include: rideInclude,
      orderBy: [{ departureDate: "desc" }, { departureTime: "desc" }],
    }),
  ]);

  return {
    upcomingHosted,
    upcomingJoined,
    pastHosted,
    pastJoined,
  };
}

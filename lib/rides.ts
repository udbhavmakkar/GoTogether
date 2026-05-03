import { prisma } from "@/lib/db";
import { isUpcomingRide } from "@/lib/ride-time";

type PublicBrowserRide = {
  id: string;
  startLocation: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  totalSeats: number;
  womenOnly: boolean;
  host: {
    name: string;
    gender: null;
  };
  joinedUsers: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      gender: null;
    };
  }>;
};

type PrivateBrowserRide = {
  id: string;
  startLocation: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  totalSeats: number;
  womenOnly: boolean;
  host: {
    name: string;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
  };
  joinedUsers: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      gender: "MALE" | "FEMALE" | "OTHER" | null;
    };
  }>;
};

const listRideInclude = {
  host: {
    select: {
      name: true,
      gender: true,
    },
  },
  joinedUsers: {
    select: {
      id: true,
      user: {
        select: {
          id: true,
          name: true,
          gender: true,
        },
      },
    },
  },
} as const;

const publicListRideInclude = {
  host: {
    select: {
      name: true,
      gender: true,
    },
  },
  joinedUsers: {
    select: {
      id: true,
    },
  },
} as const;

const rideCollectionInclude = {
  host: {
    select: {
      name: true,
    },
  },
  joinedUsers: {
    select: {
      id: true,
      userId: true,
    },
  },
} as const;

function getStartOfToday(now = new Date()) {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export async function deleteExpiredRides(now = new Date()) {
  const startOfToday = getStartOfToday(now);
  const expiredRides = await prisma.ride.findMany({
    where: {
      departureDate: {
        lt: startOfToday,
      },
    },
    select: {
      id: true,
    },
  });

  if (expiredRides.length === 0) {
    return 0;
  }

  const deleted = await prisma.ride.deleteMany({
    where: {
      id: {
        in: expiredRides.map((ride) => ride.id),
      },
    },
  });

  return deleted.count;
}

export async function getRideById(id: string) {
  await deleteExpiredRides();

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
  const now = new Date();
  await deleteExpiredRides(now);
  const rides = await prisma.ride.findMany({
    where: {
      departureDate: {
        gte: getStartOfToday(now),
      },
    },
    include: listRideInclude,
    orderBy: [{ departureDate: "asc" }, { departureTime: "asc" }, { createdAt: "desc" }],
  });

  return rides
    .filter((ride) => isUpcomingRide(ride.departureDate, ride.departureTime, now))
    .map(
      (ride): PrivateBrowserRide => ({
        id: ride.id,
        startLocation: ride.startLocation,
        destination: ride.destination,
        departureDate: ride.departureDate.toISOString(),
        departureTime: ride.departureTime,
        totalSeats: ride.totalSeats,
        womenOnly: ride.womenOnly,
        host: {
          name: ride.host.name,
          gender: ride.host.gender,
        },
        joinedUsers: ride.joinedUsers.map((booking) => ({
          id: booking.id,
          user: {
            id: booking.user.id,
            name: booking.user.name,
            gender: booking.user.gender,
          },
        })),
      }),
    );
}

export async function listPublicRides() {
  const now = new Date();
  await deleteExpiredRides(now);
  const rides = await prisma.ride.findMany({
    where: {
      departureDate: {
        gte: getStartOfToday(now),
      },
    },
    include: publicListRideInclude,
    orderBy: [{ departureDate: "asc" }, { departureTime: "asc" }, { createdAt: "desc" }],
  });

  return rides
    .filter((ride) => isUpcomingRide(ride.departureDate, ride.departureTime, now))
    .map(
      (ride): PublicBrowserRide => ({
        id: ride.id,
        startLocation: ride.startLocation,
        destination: ride.destination,
        departureDate: ride.departureDate.toISOString(),
        departureTime: ride.departureTime,
        totalSeats: ride.totalSeats,
        womenOnly: ride.womenOnly,
        host: {
          name: "",
          gender: null,
        },
        joinedUsers: ride.joinedUsers.map((booking) => ({
          id: booking.id,
          user: {
            id: "hidden",
            name: "",
            gender: null,
          },
        })),
      }),
    );
}

export async function getUserRideCollections(userId: string, now: Date) {
  await deleteExpiredRides(now);

  const [hostedRides, joinedRides] = await Promise.all([
    prisma.ride.findMany({
      where: {
        hostId: userId,
      },
      include: rideCollectionInclude,
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
      include: rideCollectionInclude,
      orderBy: [{ departureDate: "asc" }, { departureTime: "asc" }],
    }),
  ]);

  const upcomingHosted = hostedRides.filter((ride) => isUpcomingRide(ride.departureDate, ride.departureTime, now));
  const upcomingJoined = joinedRides.filter((ride) => isUpcomingRide(ride.departureDate, ride.departureTime, now));

  return {
    upcomingHosted,
    upcomingJoined,
    pastHosted: [],
    pastJoined: [],
  };
}

import { cache } from "react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const getCurrentUser = cache(async () => {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email: session.user.email.toLowerCase(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
    },
  });
});

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Please log in or register first.");
  }

  return user;
}

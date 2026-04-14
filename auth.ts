import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/db";

function isAllowedEmail(email?: string | null) {
  return Boolean(email && email.toLowerCase().endsWith("@vitstudent.ac.in"));
}

function getCleanDisplayName(name: string | null | undefined, email: string) {
  const fallbackName = email.split("@")[0];
  const trimmedName = name?.trim();

  if (!trimmedName) {
    return fallbackName;
  }

  // Strip VIT registration numbers like 23BCE0887, 21BIT0123, 22BAI1456, etc.
  const withoutRegistrationNumber = trimmedName
    .replace(/\s+\d{2}[A-Za-z]{2,4}\d{4,5}$/i, "")
    .trim();

  return withoutRegistrationNumber || fallbackName;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          hd: "vitstudent.ac.in",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!isAllowedEmail(user.email)) {
        return false;
      }

      const email = user.email!.toLowerCase();
      const cleanName = getCleanDisplayName(user.name, email);

      await prisma.user.upsert({
        where: {
          email,
        },
        update: {
          name: cleanName,
        },
        create: {
          email,
          name: cleanName,
        },
      });

      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        session.user.email = session.user.email.toLowerCase();

        // Fetch the cleaned name from the database
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { name: true },
        });

        if (dbUser?.name) {
          session.user.name = dbUser.name;
        }
      }

      return session;
    },
  },
  cookies: {
    pkceCodeVerifier: {
      name: "gotogether.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    state: {
      name: "gotogether.oauth.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    nonce: {
      name: "gotogether.oauth.nonce",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

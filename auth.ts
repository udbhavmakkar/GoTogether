import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/db";

function isAllowedEmail(email?: string | null) {
  return Boolean(email && email.toLowerCase().endsWith("@vitstudent.ac.in"));
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
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!isAllowedEmail(user.email)) {
        return false;
      }

      await prisma.user.upsert({
        where: {
          email: user.email!.toLowerCase(),
        },
        update: {
          name: user.name?.trim() || user.email!.split("@")[0],
        },
        create: {
          email: user.email!.toLowerCase(),
          name: user.name?.trim() || user.email!.split("@")[0],
        },
      });

      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        session.user.email = session.user.email.toLowerCase();
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

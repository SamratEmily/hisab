// auth.ts — Main auth config with Google + SQLite user upsert
// NOTE: This runs in Node.js runtime only (API routes, Server Components)
// Do NOT import this from middleware.ts

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;
      await prisma.user.upsert({
        where: { email: user.email! },
        create: {
          email: user.email!,
          name: user.name,
          image: user.image,
          googleId: account.providerAccountId,
        },
        update: {
          name: user.name,
          image: user.image,
          googleId: account.providerAccountId,
        },
      });
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        });
        if (dbUser) {
          (session.user as typeof session.user & { id: string }).id = dbUser.id;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
});

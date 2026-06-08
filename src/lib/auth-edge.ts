// auth-edge.ts — Minimal auth config for Edge middleware
// No prisma/sqlite imports — edge-compatible only

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth: authMiddleware } = NextAuth({
  trustHost: true,
  providers: [Google],
  pages: {
    signIn: "/",
    error: "/",
  },
});

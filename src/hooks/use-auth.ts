"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user ?? null;

  const signInWithGoogle = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return { user, loading, signInWithGoogle, signOut: handleSignOut };
}

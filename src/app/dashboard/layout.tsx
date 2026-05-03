"use client";

import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "@/components/dashboard/nav-bar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse-soft">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">৳</span>
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar user={user} />
      <main className="flex-1 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

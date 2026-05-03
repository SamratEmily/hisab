"use client";

import { CURRENCY } from "@/lib/constants";
import { ArrowUpRight, ArrowDownLeft, Scale } from "lucide-react";

interface StatsCardsProps {
  totalGiven: number;
  totalTaken: number;
}

export function StatsCards({ totalGiven, totalTaken }: StatsCardsProps) {
  const netBalance = totalTaken - totalGiven;

  const formatAmount = (amount: number) => {
    return `${CURRENCY}${Math.abs(amount).toLocaleString("en-BD")}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* দেয়া Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-500/10 dark:to-rose-500/5 border border-rose-200/50 dark:border-rose-500/20 p-5 transition-all duration-300 hover:shadow-md hover:shadow-rose-200/30 dark:hover:shadow-rose-500/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <span className="text-sm font-medium text-rose-700/70 dark:text-rose-300/70">
            মোট দেয়া
          </span>
        </div>
        <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 tracking-tight">
          {formatAmount(totalGiven)}
        </p>
        {/* Decorative */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-rose-200/30 dark:bg-rose-500/5 blur-xl" />
      </div>

      {/* পাওনা Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/20 p-5 transition-all duration-300 hover:shadow-md hover:shadow-emerald-200/30 dark:hover:shadow-emerald-500/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-emerald-700/70 dark:text-emerald-300/70">
            মোট পাওনা
          </span>
        </div>
        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 tracking-tight">
          {formatAmount(totalTaken)}
        </p>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-200/30 dark:bg-emerald-500/5 blur-xl" />
      </div>

      {/* Net Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-accent/50 border border-border p-5 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            নেট ব্যালেন্স
          </span>
        </div>
        <p
          className={`text-2xl font-bold tracking-tight ${
            netBalance > 0
              ? "text-emerald-700 dark:text-emerald-300"
              : netBalance < 0
              ? "text-rose-700 dark:text-rose-300"
              : "text-foreground"
          }`}
        >
          {netBalance > 0 ? "+" : netBalance < 0 ? "-" : ""}
          {formatAmount(netBalance)}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {netBalance > 0
            ? "আপনি পাবেন"
            : netBalance < 0
            ? "আপনি দেবেন"
            : "সমান"}
        </p>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/5 blur-xl" />
      </div>
    </div>
  );
}

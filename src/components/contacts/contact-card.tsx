"use client";

import Link from "next/link";
import { CURRENCY, RELATION_OPTIONS } from "@/lib/constants";
import type { ContactWithBalance } from "@/hooks/use-contacts";
import { ChevronRight, Phone, User } from "lucide-react";

interface ContactCardProps {
  contact: ContactWithBalance;
}

export function ContactCard({ contact }: ContactCardProps) {
  const balance = contact.net_balance;
  const relationLabel = RELATION_OPTIONS.find(
    (r) => r.value === contact.relation
  )?.label;

  const formatAmount = (amount: number) =>
    `${CURRENCY}${Math.abs(amount).toLocaleString("en-BD")}`;

  return (
    <Link
      href={`/dashboard/contacts/${contact.id}`}
      className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-sm transition-all duration-200"
    >
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <User className="w-5 h-5 text-primary" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {contact.name}
          </h3>
          {relationLabel && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground font-medium shrink-0">
              {relationLabel}
            </span>
          )}
        </div>
        {contact.phone && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3" />
            {contact.phone}
          </p>
        )}
      </div>

      {/* Balance */}
      <div className="text-right shrink-0">
        {balance !== 0 ? (
          <>
            <p
              className={`text-sm font-bold ${
                balance > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {balance > 0 ? "+" : "-"}
              {formatAmount(balance)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {balance > 0 ? "পাওনা" : "দেয়া"}
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">সমান</p>
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
    </Link>
  );
}

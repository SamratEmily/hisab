"use client";

import { CURRENCY } from "@/lib/constants";
import type { TransactionWithContact } from "@/hooks/use-transactions";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TransactionCardProps {
  transaction: TransactionWithContact & { runningBalance?: number };
  onDelete?: (id: string) => void;
  showContact?: boolean;
}

export function TransactionCard({
  transaction,
  onDelete,
  showContact = true,
}: TransactionCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isGiven = transaction.type === "given";

  // Support both camelCase (Prisma) and snake_case (legacy)
  const txDate = transaction.transactionDate || transaction.transaction_date;

  const formatAmount = (amount: number) =>
    `${CURRENCY}${Math.abs(amount).toLocaleString("en-BD")}`;

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete?.(transaction.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="group flex items-center gap-3 p-3.5 rounded-xl hover:bg-accent/50 transition-all duration-200">
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isGiven
            ? "bg-rose-100 dark:bg-rose-500/15"
            : "bg-emerald-100 dark:bg-emerald-500/15"
        }`}
      >
        {isGiven ? (
          <ArrowUpRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        ) : (
          <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {showContact && (
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground truncate">
                {transaction.contact?.name}
              </span>
            </div>
          )}
          {!showContact && transaction.description && (
            <span className="text-sm text-foreground truncate">
              {transaction.description}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {txDate
              ? format(new Date(txDate), "dd MMM yyyy", { locale: bn })
              : ""}
          </span>
          {showContact && transaction.description && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-xs text-muted-foreground truncate">
                {transaction.description}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p
          className={`text-sm font-bold ${
            isGiven
              ? "text-rose-600 dark:text-rose-400"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {isGiven ? "-" : "+"}
          {formatAmount(transaction.amount)}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {isGiven ? "দেয়া" : "পাওনা"}
        </p>
      </div>

      {/* Delete button */}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer ${
            confirmDelete
              ? "text-destructive bg-destructive/10 opacity-100"
              : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          }`}
          onClick={handleDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}

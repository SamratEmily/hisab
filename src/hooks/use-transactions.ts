"use client";

import { useEffect, useState, useCallback } from "react";
import type { TransactionFormData } from "@/lib/types";

export interface TransactionWithContact {
  id: string;
  userId: string;
  contactId: string;
  amount: number;
  type: "given" | "taken";
  description: string | null;
  transactionDate: string;
  transaction_date: string;
  createdAt: string;
  contact: { id: string; name: string; phone: string | null };
}

export function useTransactions(contactId?: string) {
  const [transactions, setTransactions] = useState<TransactionWithContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const url = contactId
        ? `/api/transactions?contactId=${contactId}`
        : "/api/transactions";
      const res = await fetch(url);
      if (res.ok) {
        setTransactions(await res.json());
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (data: TransactionFormData) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      return { error: json.error ?? "Failed to add transaction" };
    }
    await fetchTransactions();
    return { error: null };
  };

  const deleteTransaction = async (id: string) => {
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      return { error: json.error ?? "Failed to delete transaction" };
    }
    await fetchTransactions();
    return { error: null };
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}

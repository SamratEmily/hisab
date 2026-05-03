"use client";

import { useEffect, useState, useCallback } from "react";
import type { ContactFormData } from "@/lib/types";

export interface ContactWithBalance {
  id: string;
  userId: string;
  name: string;
  phone: string | null;
  relation: string | null;
  occupation: string | null;
  createdAt: string;
  updatedAt: string;
  total_given: number;
  total_taken: number;
  net_balance: number;
}

export function useContacts() {
  const [contacts, setContacts] = useState<ContactWithBalance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts");
      if (res.ok) {
        setContacts(await res.json());
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addContact = async (data: ContactFormData) => {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      return { error: json.error ?? "Failed to add contact" };
    }
    await fetchContacts();
    return { error: null };
  };

  const updateContact = async (id: string, data: ContactFormData) => {
    const res = await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      return { error: json.error ?? "Failed to update contact" };
    }
    await fetchContacts();
    return { error: null };
  };

  const deleteContact = async (id: string) => {
    const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      return { error: json.error ?? "Failed to delete contact" };
    }
    await fetchContacts();
    return { error: null };
  };

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts,
  };
}

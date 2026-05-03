"use client";

import { useContacts } from "@/hooks/use-contacts";
import { ContactCard } from "@/components/contacts/contact-card";
import { Loader2, ArrowDownLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CURRENCY } from "@/lib/constants";

export default function PaonaPage() {
  const { contacts, loading } = useContacts();
  const [search, setSearch] = useState("");

  // Filter contacts where others owe user money (net_balance > 0)
  const paonaContacts = contacts
    .filter((c) => c.net_balance > 0)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.net_balance - a.net_balance); // Most owed first

  const totalPaona = paonaContacts.reduce(
    (sum, c) => sum + c.net_balance,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">পাওনা</h1>
            <p className="text-sm text-muted-foreground">
              যাদের কাছ থেকে টাকা পাবেন
            </p>
          </div>
        </div>
      </div>

      {/* Total */}
      {paonaContacts.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/30 dark:from-emerald-500/10 dark:to-emerald-500/5 rounded-2xl p-5 border border-emerald-200/50 dark:border-emerald-500/20">
          <p className="text-sm text-emerald-600/70 dark:text-emerald-300/70 mb-1">
            মোট পাওনা
          </p>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
            {CURRENCY}
            {totalPaona.toLocaleString("en-BD")}
          </p>
          <p className="text-xs text-emerald-600/50 dark:text-emerald-300/50 mt-1">
            {paonaContacts.length} জনের কাছে
          </p>
        </div>
      )}

      {/* Search */}
      {contacts.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="নাম দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Contact List */}
      {paonaContacts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <ArrowDownLeft className="w-8 h-8 text-emerald-300" />
          </div>
          <p className="text-muted-foreground text-sm">
            {search ? "কোন ফলাফল পাওয়া যায়নি" : "কারো পাওনা নেই"}
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            কেউ আপনার কাছে টাকা নিলে এখানে দেখা যাবে
          </p>
        </div>
      ) : (
        <div className="space-y-2 stagger-children">
          {paonaContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}

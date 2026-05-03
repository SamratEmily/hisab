"use client";

import { useContacts } from "@/hooks/use-contacts";
import { ContactCard } from "@/components/contacts/contact-card";
import { Loader2, ArrowUpRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CURRENCY } from "@/lib/constants";

export default function DeyaPage() {
  const { contacts, loading } = useContacts();
  const [search, setSearch] = useState("");

  // Filter contacts where user owes money (net_balance < 0)
  const deyaContacts = contacts
    .filter((c) => c.net_balance < 0)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.net_balance - b.net_balance); // Most owed first

  const totalDeya = deyaContacts.reduce(
    (sum, c) => sum + Math.abs(c.net_balance),
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
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/15 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">দেয়া</h1>
            <p className="text-sm text-muted-foreground">
              যাদের টাকা দিতে হবে
            </p>
          </div>
        </div>
      </div>

      {/* Total */}
      {deyaContacts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 to-rose-100/30 dark:from-rose-500/10 dark:to-rose-500/5 rounded-2xl p-5 border border-rose-200/50 dark:border-rose-500/20">
          <p className="text-sm text-rose-600/70 dark:text-rose-300/70 mb-1">
            মোট দিতে হবে
          </p>
          <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">
            {CURRENCY}
            {totalDeya.toLocaleString("en-BD")}
          </p>
          <p className="text-xs text-rose-600/50 dark:text-rose-300/50 mt-1">
            {deyaContacts.length} জনকে
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
      {deyaContacts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
            <ArrowUpRight className="w-8 h-8 text-rose-300" />
          </div>
          <p className="text-muted-foreground text-sm">
            {search ? "কোন ফলাফল পাওয়া যায়নি" : "কাউকে দেয়া নেই"}
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            আপনি কাউকে টাকা দিলে এখানে দেখা যাবে
          </p>
        </div>
      ) : (
        <div className="space-y-2 stagger-children">
          {deyaContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}

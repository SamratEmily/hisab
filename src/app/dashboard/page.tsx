"use client";

import { useContacts } from "@/hooks/use-contacts";
import { useTransactions } from "@/hooks/use-transactions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { ContactForm } from "@/components/contacts/contact-form";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, UserPlus, Receipt } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const { contacts, loading: contactsLoading, addContact } = useContacts();
  const {
    transactions,
    loading: txLoading,
    addTransaction,
    deleteTransaction,
  } = useTransactions();
  const [txFormOpen, setTxFormOpen] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false);

  const totalGiven = contacts.reduce((sum, c) => sum + c.total_given, 0);
  const totalTaken = contacts.reduce((sum, c) => sum + c.total_taken, 0);

  const loading = contactsLoading || txLoading;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ড্যাশবোর্ড</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            আপনার লেনদেনের সারসংক্ষেপ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setContactFormOpen(true)}
            className="hidden sm:flex cursor-pointer"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            পরিচিতি
          </Button>
          <Button
            size="sm"
            onClick={() => setTxFormOpen(true)}
            disabled={contacts.length === 0}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            লেনদেন
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards totalGiven={totalGiven} totalTaken={totalTaken} />

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            সাম্প্রতিক লেনদেন
          </h2>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-primary/40" />
            </div>
            <p className="text-muted-foreground text-sm">
              কোন লেনদেন নেই
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              {contacts.length === 0
                ? "প্রথমে একটি পরিচিতি যোগ করুন"
                : "উপরের বাটনে ক্লিক করে লেনদেন যোগ করুন"}
            </p>
            {contacts.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 cursor-pointer"
                onClick={() => setContactFormOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                পরিচিতি যোগ করুন
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/30 stagger-children">
            {transactions.slice(0, 15).map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onDelete={deleteTransaction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Forms */}
      <TransactionForm
        open={txFormOpen}
        onOpenChange={setTxFormOpen}
        onSubmit={addTransaction}
        contacts={contacts.map((c) => ({ id: c.id, name: c.name }))}
      />
      <ContactForm
        open={contactFormOpen}
        onOpenChange={setContactFormOpen}
        onSubmit={addContact}
      />
    </div>
  );
}

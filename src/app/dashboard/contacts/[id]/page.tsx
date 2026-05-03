"use client";

import { useParams, useRouter } from "next/navigation";
import { useContacts } from "@/hooks/use-contacts";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionCard } from "@/components/transactions/transaction-card";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { ContactForm } from "@/components/contacts/contact-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CURRENCY, RELATION_OPTIONS } from "@/lib/constants";
import {
  Loader2,
  ArrowLeft,
  Plus,
  Phone,
  Briefcase,
  User,
  Pencil,
  Trash2,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import type { ContactFormData } from "@/lib/types";

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;

  const { contacts, loading: contactsLoading, updateContact, deleteContact } = useContacts();
  const { transactions, loading: txLoading, addTransaction, deleteTransaction } =
    useTransactions(contactId);

  const [txFormOpen, setTxFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const contact = contacts.find((c) => c.id === contactId);
  const loading = contactsLoading || txLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">পরিচিতি পাওয়া যায়নি</p>
        <Button
          variant="outline"
          className="mt-4 cursor-pointer"
          onClick={() => router.push("/dashboard/contacts")}
        >
          ফিরে যান
        </Button>
      </div>
    );
  }

  const balance = contact.net_balance;
  const relationLabel = RELATION_OPTIONS.find(
    (r) => r.value === contact.relation
  )?.label;

  const formatAmount = (amount: number) =>
    `${CURRENCY}${Math.abs(amount).toLocaleString("en-BD")}`;

  const handleDeleteContact = async () => {
    if (confirmDelete) {
      await deleteContact(contactId);
      router.push("/dashboard/contacts");
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  // Compute running balance (sort by date asc)
  const sortedTxs = [...transactions].sort(
    (a, b) =>
      new Date(a.transactionDate).getTime() -
      new Date(b.transactionDate).getTime()
  );
  let runningBalance = 0;
  const txsWithBalance = sortedTxs.map((tx) => {
    if (tx.type === "taken") {
      runningBalance += Number(tx.amount);
    } else {
      runningBalance -= Number(tx.amount);
    }
    return { ...tx, runningBalance };
  });
  txsWithBalance.reverse(); // Show newest first

  const handleUpdateContact = (id: string) => async (data: ContactFormData) => {
    return updateContact(id, data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="cursor-pointer -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          ফিরে যান
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => setEditFormOpen(true)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 cursor-pointer ${
              confirmDelete
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground hover:text-destructive"
            }`}
            onClick={handleDeleteContact}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Contact Info Card */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">
              {contact.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {relationLabel && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-accent text-muted-foreground font-medium">
                  {relationLabel}
                </span>
              )}
              {contact.phone && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {contact.phone}
                </span>
              )}
              {contact.occupation && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {contact.occupation}
                </span>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-5" />

        {/* Balance Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">দেনা</p>
            <p className="text-base font-bold text-rose-600 dark:text-rose-400">
              {formatAmount(contact.total_given)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">নিয়েছি</p>
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {formatAmount(contact.total_taken)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">ব্যালেন্স</p>
            <p
              className={`text-base font-bold ${
                balance > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : balance < 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-foreground"
              }`}
            >
              {balance > 0 ? "+" : balance < 0 ? "-" : ""}
              {formatAmount(balance)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {balance > 0 ? "আপনি পাবেন" : balance < 0 ? "আপনি দেবেন" : "সমান"}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            লেনদেনের ইতিহাস
          </h2>
          <Button
            size="sm"
            onClick={() => setTxFormOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            লেনদেন
          </Button>
        </div>

        {txsWithBalance.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-7 h-7 text-primary/40" />
            </div>
            <p className="text-muted-foreground text-sm">কোন লেনদেন নেই</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="grid grid-cols-[1fr,auto] px-4 py-2.5 bg-accent/50 text-xs text-muted-foreground font-medium">
              <span>লেনদেন</span>
              <span>রানিং ব্যালেন্স</span>
            </div>
            <div className="divide-y divide-border/30">
              {txsWithBalance.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-[1fr,auto] items-center"
                >
                  <TransactionCard
                    transaction={tx}
                    onDelete={deleteTransaction}
                    showContact={false}
                  />
                  <div className="pr-4 text-right">
                    <p
                      className={`text-xs font-semibold ${
                        tx.runningBalance > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : tx.runningBalance < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {tx.runningBalance > 0
                        ? "+"
                        : tx.runningBalance < 0
                        ? "-"
                        : ""}
                      {formatAmount(tx.runningBalance)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Forms */}
      <TransactionForm
        open={txFormOpen}
        onOpenChange={setTxFormOpen}
        onSubmit={addTransaction}
        contacts={[{ id: contact.id, name: contact.name }]}
        preselectedContactId={contact.id}
      />

      {editFormOpen && (
        <ContactForm
          key="edit"
          open={editFormOpen}
          onOpenChange={setEditFormOpen}
          onSubmit={handleUpdateContact(contact.id)}
          initialData={contact}
        />
      )}
    </div>
  );
}

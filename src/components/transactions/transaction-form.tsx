"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CURRENCY } from "@/lib/constants";
import type { TransactionFormData, Contact } from "@/lib/types";
import { Loader2, CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => Promise<{ error: string | null }>;
  contacts: Pick<Contact, "id" | "name">[];
  preselectedContactId?: string;
}

export function TransactionForm({
  open,
  onOpenChange,
  onSubmit,
  contacts,
  preselectedContactId,
}: TransactionFormProps) {
  const [contactId, setContactId] = useState(preselectedContactId || "");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"given" | "taken">("given");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactId) {
      setError("পরিচিতি বাছাই করুন");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("সঠিক পরিমাণ দিন");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await onSubmit({
      contact_id: contactId,
      amount: Number(amount),
      type,
      description: description.trim() || undefined,
      transaction_date: format(date, "yyyy-MM-dd"),
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setContactId(preselectedContactId || "");
      setAmount("");
      setType("given");
      setDescription("");
      setDate(new Date());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            নতুন লেনদেন
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Selection */}
          <div className="space-y-2">
            <Label htmlFor="tx-contact">
              পরিচিতি <span className="text-destructive">*</span>
            </Label>
            <Select
              value={contactId}
              onValueChange={(v) => setContactId(v ?? "")}
              disabled={!!preselectedContactId}
            >
              <SelectTrigger id="tx-contact">
                <SelectValue placeholder="পরিচিতি বাছাই করুন" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>ধরন</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("given")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  type === "given"
                    ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/50"
                    : "border-border bg-card text-muted-foreground hover:border-border hover:bg-accent"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                  />
                </svg>
                দেনা
              </button>
              <button
                type="button"
                onClick={() => setType("taken")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  type === "taken"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/50"
                    : "border-border bg-card text-muted-foreground hover:border-border hover:bg-accent"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                  />
                </svg>
                নিয়েছি
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="tx-amount">
              পরিমাণ ({CURRENCY}) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {CURRENCY}
              </span>
              <Input
                id="tx-amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg font-semibold"
                min="0"
                step="any"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>তারিখ</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger
                className="flex items-center w-full justify-start rounded-lg border border-input bg-transparent py-2 px-3 text-sm h-9 hover:bg-accent transition-colors cursor-pointer"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{format(date, "dd MMMM yyyy", { locale: bn })}</span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    if (d) setDate(d);
                    setCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="tx-description">বিবরণ</Label>
            <Input
              id="tx-description"
              placeholder="যেমন: বাজারের টাকা"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              বাতিল
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              সংরক্ষণ করুন
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

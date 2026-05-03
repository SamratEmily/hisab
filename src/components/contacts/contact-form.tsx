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
import { RELATION_OPTIONS } from "@/lib/constants";
import type { ContactFormData, Contact } from "@/lib/types";
import { Loader2, UserPlus, Pencil } from "lucide-react";

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ContactFormData) => Promise<{ error: string | null }>;
  initialData?: Contact;
}

export function ContactForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ContactFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [relation, setRelation] = useState(initialData?.relation || "");
  const [occupation, setOccupation] = useState(initialData?.occupation || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("নাম দিতে হবে");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await onSubmit({
      name: name.trim(),
      phone: phone.trim() || undefined,
      relation: relation || undefined,
      occupation: occupation.trim() || undefined,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      // Reset form and close
      setName("");
      setPhone("");
      setRelation("");
      setOccupation("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Pencil className="w-5 h-5 text-primary" />
                পরিচিতি সম্পাদনা
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-primary" />
                নতুন পরিচিতি
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">
              নাম <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-name"
              placeholder="যেমন: রহিম চাচা"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">ফোন নম্বর</Label>
            <Input
              id="contact-phone"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-relation">সম্পর্ক</Label>
            <Select value={relation} onValueChange={(v) => setRelation(v ?? "")}>
              <SelectTrigger id="contact-relation">
                <SelectValue placeholder="সম্পর্ক বাছাই করুন" />
              </SelectTrigger>
              <SelectContent>
                {RELATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-occupation">পেশা</Label>
            <Input
              id="contact-occupation"
              placeholder="যেমন: ব্যবসায়ী"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
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
              {isEditing ? "আপডেট করুন" : "যোগ করুন"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

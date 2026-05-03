"use client";

import { useContacts } from "@/hooks/use-contacts";
import { ContactCard } from "@/components/contacts/contact-card";
import { ContactForm } from "@/components/contacts/contact-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, Users, Search } from "lucide-react";
import { useState } from "react";

export default function ContactsPage() {
  const { contacts, loading, addContact } = useContacts();
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">পরিচিতি</h1>
            <p className="text-sm text-muted-foreground">
              {contacts.length} জন পরিচিতি
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setFormOpen(true)}
          className="cursor-pointer"
        >
          <UserPlus className="w-4 h-4 mr-1.5" />
          যোগ করুন
        </Button>
      </div>

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

      {/* List */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary/40" />
          </div>
          <p className="text-muted-foreground text-sm">
            {search
              ? "কোন ফলাফল পাওয়া যায়নি"
              : "কোন পরিচিতি নেই"}
          </p>
          {!search && (
            <>
              <p className="text-muted-foreground/60 text-xs mt-1">
                আপনার পরিচিতি যোগ করুন
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 cursor-pointer"
                onClick={() => setFormOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                পরিচিতি যোগ করুন
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2 stagger-children">
          {filteredContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}

      <ContactForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={addContact}
      />
    </div>
  );
}

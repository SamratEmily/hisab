// ============================================================
// Hisab — Core Types (SQLite/Prisma version)
// ============================================================

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phone: string | null;
  relation: string | null;
  occupation: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "given" | "taken";

export interface Transaction {
  id: string;
  userId: string;
  contactId: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  transactionDate: string;
  createdAt: string;
}

// Form types
export interface ContactFormData {
  name: string;
  phone?: string;
  relation?: string;
  occupation?: string;
}

export interface TransactionFormData {
  contact_id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  transaction_date: string;
}

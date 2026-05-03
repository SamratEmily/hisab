import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function getUserId() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  return user?.id ?? null;
}

// GET /api/transactions?contactId=xxx
export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");

  const where = contactId
    ? { userId, contactId }
    : { userId };

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: [
      { transactionDate: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      contact: { select: { id: true, name: true, phone: true } },
    },
  });

  // Remap to match existing UI types (camelCase → snake_case for contact)
  const result = transactions.map((t) => ({
    ...t,
    transaction_date: t.transactionDate,
    contact: t.contact,
  }));

  return NextResponse.json(result);
}

// POST /api/transactions
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { contact_id, amount, type, description, transaction_date } = body;

  if (!contact_id || !amount || !type || !transaction_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["given", "taken"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Verify contact belongs to user
  const contact = await prisma.contact.findFirst({
    where: { id: contact_id, userId },
  });
  if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      contactId: contact_id,
      amount: Number(amount),
      type,
      description: description?.trim() || null,
      transactionDate: transaction_date,
    },
    include: {
      contact: { select: { id: true, name: true, phone: true } },
    },
  });

  return NextResponse.json(transaction, { status: 201 });
}

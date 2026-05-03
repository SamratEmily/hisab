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

// GET /api/contacts — list all contacts with computed balances
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      transactions: {
        select: { amount: true, type: true },
      },
    },
  });

  const result = contacts.map((c) => {
    const totalGiven = c.transactions
      .filter((t) => t.type === "given")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalTaken = c.transactions
      .filter((t) => t.type === "taken")
      .reduce((sum, t) => sum + t.amount, 0);

    const { transactions: _, ...rest } = c;
    void _;
    return {
      ...rest,
      total_given: totalGiven,
      total_taken: totalTaken,
      net_balance: totalTaken - totalGiven,
    };
  });

  return NextResponse.json(result);
}

// POST /api/contacts — create a new contact
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, phone, relation, occupation } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "নাম দিতে হবে" }, { status: 400 });
  }

  const contact = await prisma.contact.create({
    data: {
      userId,
      name: name.trim(),
      phone: phone?.trim() || null,
      relation: relation || null,
      occupation: occupation?.trim() || null,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}

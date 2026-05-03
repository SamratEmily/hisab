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

// PATCH /api/contacts/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { name, phone, relation, occupation } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "নাম দিতে হবে" }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.contact.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contact = await prisma.contact.update({
    where: { id },
    data: {
      name: name.trim(),
      phone: phone?.trim() || null,
      relation: relation || null,
      occupation: occupation?.trim() || null,
    },
  });

  return NextResponse.json(contact);
}

// DELETE /api/contacts/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.contact.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.contact.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

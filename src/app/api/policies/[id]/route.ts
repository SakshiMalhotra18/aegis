import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

// PATCH /api/policies/:id
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description, rules, status, agentId } = body;

    const policy = await prisma.policy.update({
      where: { id },
      data: {
        name,
        description: description || "",
        rules,
        status,
        agentId: agentId || null,
      },
    });
    return NextResponse.json(policy);
  } catch {
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
  }
}

// DELETE /api/policies/:id
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.policy.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete policy" }, { status: 500 });
  }
}

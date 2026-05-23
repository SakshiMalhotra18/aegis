import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

// PATCH /api/agents/:id
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, model, status, riskLevel, blastRadius } = body;

    const agent = await prisma.agent.update({
      where: { id },
      data: { name, description, model, status, riskLevel, blastRadius },
    });
    return NextResponse.json(agent);
  } catch {
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

// DELETE /api/agents/:id
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Delete related records first to avoid FK constraint errors
    await prisma.auditLog.deleteMany({ where: { agentId: id } });
    await prisma.approval.deleteMany({ where: { agentId: id } });
    await prisma.policy.deleteMany({ where: { agentId: id } });
    await prisma.agent.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}

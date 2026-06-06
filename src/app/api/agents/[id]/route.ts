import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { writeAuditLog } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

// PATCH /api/agents/:id
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description, model, status, riskLevel, blastRadius } = body;

    const agent = await prisma.agent.update({
      where: { id },
      data: { name, description, model, status, riskLevel, blastRadius },
    });

    await writeAuditLog({
  userId: session.user.id,
  action: AuditAction.UPDATED,
  resourceType: "Agent",
  resourceId: agent.id,
  details: { name: agent.name },
  agentId: agent.id,
});
    return NextResponse.json(agent);
  } catch {
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

// DELETE /api/agents/:id
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const agent = await prisma.agent.findUnique({
      where: { id },
      select: { name: true }
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Delete related records first to avoid FK constraint errors
    await prisma.auditLog.deleteMany({ where: { agentId: id } });
    await prisma.approval.deleteMany({ where: { agentId: id } });
    await prisma.policy.deleteMany({ where: { agentId: id } });
    await prisma.agent.delete({ where: { id } });

    await writeAuditLog({
  userId: session.user.id,
  action: AuditAction.DELETED,
  resourceType: "Agent",
  resourceId: undefined,
  details: { name: agent.name },
});
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}

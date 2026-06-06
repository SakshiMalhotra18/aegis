import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { writeAuditLog } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

// PATCH /api/approvals/:id
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED or REJECTED." },
        { status: 400 }
      );
    }

    const approval = await prisma.approval.update({
      where: { id },
      data: { status },
      include: { agent: { select: { name: true } } },
    });

    await writeAuditLog({
      userId: session.user.id,
      action: status === "APPROVED" ? AuditAction.APPROVED : AuditAction.REJECTED,
      resourceType: "Approval",
      resourceId: approval.id,
      details: { status },
      approvalId: approval.id,
      agentId: approval.agentId,
    });

    return NextResponse.json(approval);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update approval" },
      { status: 500 }
    );
  }
}

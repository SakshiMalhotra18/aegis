import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/client";
import { writeAuditLog } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const apiKey = await prisma.apiKey.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!apiKey) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  await prisma.apiKey.update({
    where: { id },
    data: { isActive: false },
  });

  await writeAuditLog({
    userId: session.user.id,
    action: AuditAction.DELETED,
    resourceType: "ApiKey",
    resourceId: id,
    details: { keyName: apiKey.name, keyPrefix: apiKey.keyPrefix },
  });
  return NextResponse.json({ success: true })
}

import { prisma } from "@/lib/prisma/client";
import { AuditAction } from "@prisma/client";

export async function writeAuditLog(
  action: AuditAction,
  message: string,
  agentId?: string,
  userId?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        message,
        agentId: agentId || null,
        userId: userId || null,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}

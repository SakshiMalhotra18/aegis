import { prisma } from "./prisma/client";
import { AuditAction } from "@prisma/client";

export interface AuditLogOptions {
  userId: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: any;
  agentId?: string | null;
  policyId?: string | null;
  approvalId?: string | null;
}

export async function writeAuditLog(options: AuditLogOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId,
        action: options.action,
        resourceType: options.resourceType,
        resourceId: options.resourceId ?? null,
        details: (options.details ?? {}) as any,
        agentId: options.agentId ?? null,
        policyId: options.policyId ?? null,
        approvalId: options.approvalId ?? null,
      },
    });
  } catch (error) {
    console.error('[writeAuditLog] Failed to write audit log:', error);
  }
}

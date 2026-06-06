import { PrismaClient, RiskLevel, ApprovalStatus, AuditAction } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin1234!", 10);
  
  const user = await prisma.user.create({
    data: {
      email: "admin@aegis.ai",
      password: hashedPassword,
      name: "Admin",
    },
  });

  const agent1 = await prisma.agent.create({
    data: {
      name: "Agent Low",
      description: JSON.stringify({ text: "Agent Low description", model: "gpt-4", blastRadius: 10 }),
      riskLevel: RiskLevel.LOW,
      userId: user.id,
    },
  });

  const agent2 = await prisma.agent.create({
    data: {
      name: "Agent Medium",
      description: JSON.stringify({ text: "Agent Medium description", model: "gpt-4", blastRadius: 10 }),
      riskLevel: RiskLevel.MEDIUM,
      userId: user.id,
    },
  });

  const agent3 = await prisma.agent.create({
    data: {
      name: "Agent High",
      description: JSON.stringify({ text: "Agent High description", model: "gpt-4", blastRadius: 10 }),
      riskLevel: RiskLevel.HIGH,
      userId: user.id,
    },
  });

  const policy1 = await prisma.policy.create({
    data: {
      name: "Policy 1",
      description: "Policy 1 description",
      rules: "Rules 1",
      status: "ACTIVE",
      userId: user.id,
      agentId: agent1.id,
    },
  });

  const policy2 = await prisma.policy.create({
    data: {
      name: "Policy 2",
      description: "Policy 2 description",
      rules: "Rules 2",
      status: "ACTIVE",
      userId: user.id,
      agentId: agent2.id,
    },
  });

  await prisma.approval.create({
    data: {
      status: ApprovalStatus.PENDING,
      agentId: agent1.id,
      userId: user.id,
    },
  });

  await prisma.approval.create({
    data: {
      status: ApprovalStatus.APPROVED,
      agentId: agent2.id,
      userId: user.id,
    },
  });

  const actions = [
    AuditAction.CREATED,
    AuditAction.UPDATED,
    AuditAction.DELETED,
    AuditAction.APPROVED,
    AuditAction.TRIGGERED,
  ];

  for (let i = 0; i < actions.length; i++) {
    await prisma.auditLog.create({
      data: {
        action: actions[i],
        resourceType: "AuditLog",
        details: { message: `Action ${actions[i]} occurred` },
        userId: user.id,
        agentId: agent1.id,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

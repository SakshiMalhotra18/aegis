import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [totalAgents, totalPolicies, pendingApprovals, todayAudits, highRiskAgents, recentAudits] = await Promise.all([
      prisma.agent.count(),
      prisma.policy.count(),
      prisma.approval.count({ where: { status: "PENDING" } }),
      prisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.agent.findMany({
        where: { riskLevel: { in: ["HIGH", "CRITICAL"] } },
        select: { id: true, name: true, riskLevel: true },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, action: true, message: true, agentId: true, userId: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      totalAgents,
      activePolicies: totalPolicies,
      pendingApprovals,
      todayLogs: todayAudits,
      highRiskCount: highRiskAgents,
      recentLogs: recentAudits,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

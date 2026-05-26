import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalAgents,
      activePolicies,
      pendingApprovals,
      todayLogs,
      highRiskCount,
      recentLogs,
    ] = await Promise.all([
      prisma.agent.count(),
      prisma.policy.count({ where: { status: "ACTIVE" } }),
      prisma.approval.count({ where: { status: "PENDING" } }),
      prisma.auditLog.count({ where: { createdAt: { gte: today } } }),
      prisma.agent.count({ where: { riskLevel: { in: ["HIGH", "CRITICAL"] } } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          agent: { select: { name: true } },
          user: { select: { email: true, name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalAgents,
      activePolicies,
      pendingApprovals,
      todayLogs,
      highRiskCount,
      recentLogs,
    });
  } catch (error: any) {
    console.error("Stats route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", detail: error.message },
      { status: 500 }
    );
  }
}

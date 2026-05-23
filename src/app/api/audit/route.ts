import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

// GET /api/audit
export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, agent: { select: { name: true } } },
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("API Audit Error:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs", details: String(error) }, { status: 500 });
  }
}

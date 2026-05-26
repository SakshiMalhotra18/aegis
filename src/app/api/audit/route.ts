import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

// GET /api/audit
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

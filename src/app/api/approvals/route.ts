import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

// GET /api/approvals
export async function GET() {
  try {
    const approvals = await prisma.approval.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        agent: { select: { id: true, name: true } },
        user: { select: { id: true, email: true } },
      },
    });
    return NextResponse.json(approvals);
  } catch {
    return NextResponse.json({ error: "Failed to fetch approvals" }, { status: 500 });
  }
}

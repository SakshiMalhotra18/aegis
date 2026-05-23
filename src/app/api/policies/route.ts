import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

// POST /api/policies
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, rules, status, agentId } = body;

    const policy = await prisma.policy.create({
      data: {
        name,
        description: description || "",
        rules,
        status: status || "ACTIVE",
        ownerId: "00000000-0000-0000-0000-000000000000",
        agentId: agentId || null,
      },
    });
    return NextResponse.json(policy, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  }
}

// GET /api/policies
export async function GET() {
  try {
    const policies = await prisma.policy.findMany({
      include: {
        agent: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(policies)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch policies" },
      { status: 500 }
    )
  }
}

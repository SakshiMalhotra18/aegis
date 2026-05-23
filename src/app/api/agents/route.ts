import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

// GET /api/agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(agents);
  } catch {
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

// POST /api/agents
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, model, status, riskLevel, blastRadius } = body;

    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        model,
        status: status || "ACTIVE",
        riskLevel: riskLevel || "LOW",
        blastRadius: blastRadius || 0,
        ownerId: "00000000-0000-0000-0000-000000000000", // will be replaced with session user id
      },
    });
    return NextResponse.json(agent, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}

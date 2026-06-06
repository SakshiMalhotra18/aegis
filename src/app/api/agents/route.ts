import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  model: z.string().min(1, "Model is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "ERROR"]).optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  blastRadius: z.number().int().min(1).max(100),
});

// GET /api/agents
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: "desc" },
    });
    const processedAgents = agents.map(agent => {
      let desc = agent.description || "";
      let m = "gpt-4o";
      let br = 10;
      try {
        if (agent.description && agent.description.startsWith("{")) {
          const parsed = JSON.parse(agent.description);
          desc = parsed.text ?? "";
          m = parsed.model ?? "gpt-4o";
          br = parsed.blastRadius ?? 10;
        }
      } catch {}
      return {
        ...agent,
        description: desc,
        model: m,
        blastRadius: br,
      };
    });
    return NextResponse.json(processedAgents);
  } catch {
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

// POST /api/agents
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = agentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", errors: result.error.issues }, { status: 400 });
    }

    const { name, description, model, status, riskLevel, blastRadius } = result.data;

    const descPayload = JSON.stringify({
      text: description || "",
      model: model || "gpt-4o",
      blastRadius: blastRadius || 10,
    });

    const agent = await prisma.agent.create({
      data: {
        name,
        description: descPayload,
        status: status || "ACTIVE",
        riskLevel,
        userId: session.user.id,
      },
    });

    const responseAgent = {
      ...agent,
      description: description || "",
      model: model || "gpt-4o",
      blastRadius: blastRadius || 10,
    };

    await writeAuditLog({
      userId: session.user.id,
      action: AuditAction.CREATED,
      resourceType: "Agent",
      resourceId: agent.id,
      details: { name },
      agentId: agent.id,
    });
    return NextResponse.json(responseAgent, { status: 201 });
  } catch (err: any) {
    console.error("Failed to create agent:", err);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}

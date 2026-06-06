import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

const policySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  rules: z.string().min(1, "Rules are required"),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  agentId: z.string().optional().nullable(),
});

// POST /api/policies
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = policySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", errors: result.error.issues }, { status: 400 });
    }

    const { name, description, rules, status, agentId } = result.data;

    const policy = await prisma.policy.create({
      data: {
        name,
        description: description || "",
        rules,
        status: status || "ACTIVE",
        userId: session.user.id,
        agentId: agentId || null,
      },
    });

    await writeAuditLog({
  userId: session.user.id,
  action: AuditAction.CREATED,
  resourceType: "Policy",
  resourceId: policy.id,
  details: { name: policy.name },
  policyId: policy.id,
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

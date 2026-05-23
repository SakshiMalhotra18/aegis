import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

// PATCH /api/approvals/:id
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED or REJECTED." },
        { status: 400 }
      );
    }

    const approval = await prisma.approval.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(approval);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update approval" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma/client"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await prisma.apiKey.update({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: { isActive: false },
  })
  return NextResponse.json({ success: true })
}

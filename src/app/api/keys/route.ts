import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma/client"
import { generateApiKey } from "@/lib/apikeys"
import { z } from "zod"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      isActive: true,
      lastUsedAt: true,
      createdAt: true,
    },
  })
  return NextResponse.json(keys)
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const { name } = createSchema.parse(body)
  const { raw, hash, prefix } = generateApiKey()
  await prisma.apiKey.create({
    data: {
      name,
      keyHash: hash,
      keyPrefix: prefix,
      userId: session.user.id,
    },
  })
  return NextResponse.json({ key: raw, prefix, name })
}

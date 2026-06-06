import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/client'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
    const flaggedOnly = searchParams.get('flaggedOnly') === 'true'
    const agentId = searchParams.get('agentId') ?? undefined
    const skip = (page - 1) * limit

    const userAgents = await prisma.agent.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    })
    const allowedIds = userAgents.map((a) => a.id)

    const where = {
      agentId: { in: allowedIds },
      ...(flaggedOnly ? { flagged: true } : {}),
      ...(agentId && allowedIds.includes(agentId) ? { agentId } : {}),
    }

    const [interactions, total] = await Promise.all([
      prisma.interaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { agent: { select: { id: true, name: true } } },
      }),
      prisma.interaction.count({ where }),
    ])

    return NextResponse.json({
      interactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[GET /api/interactions]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

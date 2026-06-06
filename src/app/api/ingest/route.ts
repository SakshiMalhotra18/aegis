import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'
import { hashApiKey, getApiKeyFromHeader } from '@/lib/apikeys'
import { analyzePrompt } from '@/lib/safety'
import { writeAuditLog } from '@/lib/audit'
import { AuditAction } from '@prisma/client'

const IngestSchema = z.object({
  agentId: z.string().min(1),
  prompt: z.string().min(1).max(50000),
  response: z.string().max(50000).optional().default(''),
  model: z.string().max(100).optional().default('unknown'),
  tokensUsed: z.number().int().min(0).optional().default(0),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const rawKey = getApiKeyFromHeader(req)
    if (!rawKey) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header. Use: Bearer <api_key>' },
        { status: 401 }
      )
    }

    const keyHash = hashApiKey(rawKey)
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: { user: { select: { id: true } } },
    })

    if (!apiKey || !apiKey.isActive) {
      return NextResponse.json(
        { error: 'Invalid or inactive API key' },
        { status: 401 }
      )
    }

    // Fire and forget — update lastUsedAt
    prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    }).catch(() => {})

    const body = await req.json()
    const parsed = IngestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { agentId, prompt, response, model, tokensUsed, metadata } = parsed.data

    const agent = await prisma.agent.findFirst({
      where: { id: agentId, userId: apiKey.user.id },
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found or access denied' },
        { status: 404 }
      )
    }

    const safety = analyzePrompt(prompt)

    const interaction = await prisma.interaction.create({
      data: {
        agentId,
        prompt,
        response,
        model,
        tokensUsed,
        riskScore: safety.riskScore,
        flagged: safety.flagged,
        flagReason: safety.flagReason,
        metadata: (metadata ?? {}) as any,
      },
    })

    if (safety.flagged) {
      await writeAuditLog({
        userId: apiKey.user.id,
        action: AuditAction.TRIGGERED,
        resourceType: 'Interaction',
        resourceId: interaction.id,
        details: {
          agentId,
          agentName: agent.name,
          riskScore: safety.riskScore,
          flagReason: safety.flagReason,
          detectedPatterns: safety.detectedPatterns,
        },
        agentId,
      })
    }

    return NextResponse.json(
      {
        success: true,
        interactionId: interaction.id,
        safety: {
          riskScore: safety.riskScore,
          flagged: safety.flagged,
          flagReason: safety.flagReason,
          detectedPatterns: safety.detectedPatterns,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/ingest]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

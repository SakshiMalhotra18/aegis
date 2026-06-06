import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { findToolsByNames, calculateOverallRisk } from '@/lib/shadow-ai-tools'

const ScannerRequestSchema = z.object({
  companyName: z.string().min(1),
  tools: z.array(z.string()).min(1),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = ScannerRequestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request data', details: parsed.error.format() }, { status: 400 })
    }

    const { companyName, tools } = parsed.data
    const detectedTools = findToolsByNames(tools)
    const riskSummary = calculateOverallRisk(detectedTools)

    return NextResponse.json({
      companyName,
      detectedTools,
      summary: {
        totalDetected: detectedTools.length,
        criticalCount: riskSummary.criticalCount,
        highCount: riskSummary.highCount,
        mediumCount: riskSummary.mediumCount,
        lowCount: riskSummary.lowCount,
        overallRiskScore: riskSummary.score,
        overallRiskLevel: riskSummary.level
      },
      scannedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('[POST /api/scanner]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

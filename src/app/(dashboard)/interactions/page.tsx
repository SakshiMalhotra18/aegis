'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle, Shield, ChevronLeft, ChevronRight, Activity } from 'lucide-react'

interface Interaction {
  id: string
  prompt: string
  response: string
  model: string
  tokensUsed: number
  riskScore: number
  flagged: boolean
  flagReason: string | null
  createdAt: string
  agent: { id: string; name: string }
}

interface InteractionsResponse {
  interactions: Interaction[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

function RiskBadge({ score }: { score: number }) {
  if (score >= 80)
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-mono">
        {score} CRITICAL
      </Badge>
    )
  if (score >= 60)
    return (
      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-mono">
        {score} HIGH
      </Badge>
    )
  if (score >= 30)
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-mono">
        {score} MEDIUM
      </Badge>
    )
  return (
    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
      {score} LOW
    </Badge>
  )
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function InteractionsPage() {
  const [page, setPage] = useState(1)
  const [flaggedOnly, setFlaggedOnly] = useState(false)

  const { data, isLoading, isError } = useQuery<InteractionsResponse>({
    queryKey: ['interactions', page, flaggedOnly],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        flaggedOnly: String(flaggedOnly),
      })
      const res = await fetch(`/api/interactions?${params}`)
      if (!res.ok) throw new Error('Failed to fetch interactions')
      return res.json()
    },
    staleTime: 30000,
  })

  const handleToggle = (checked: boolean) => {
    setFlaggedOnly(checked)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="h-6 w-6 text-violet-400" />
              Interaction Monitor
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time log of all AI agent interactions with safety analysis
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2">
            <Switch
              id="flagged-toggle"
              checked={flaggedOnly}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-red-500"
            />
            <Label
              htmlFor="flagged-toggle"
              className="text-slate-300 cursor-pointer flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Show Flagged Only
            </Label>
          </div>
        </div>

        {/* Stats bar */}
        {data && (
          <div className="flex gap-4 text-sm">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 text-slate-400">
              Total:{' '}
              <span className="text-white font-semibold">
                {data.pagination.total}
              </span>
            </div>
            {flaggedOnly && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400">
                Showing flagged interactions only
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400 animate-pulse">Loading interactions...</div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-red-400">Failed to load interactions</div>
            </div>
          ) : data?.interactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Shield className="h-12 w-12 text-slate-600" />
              <p className="text-slate-400">
                {flaggedOnly
                  ? 'No flagged interactions found'
                  : 'No interactions yet — send your first ingest request'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Time</TableHead>
                  <TableHead className="text-slate-400">Agent</TableHead>
                  <TableHead className="text-slate-400">Prompt Preview</TableHead>
                  <TableHead className="text-slate-400">Model</TableHead>
                  <TableHead className="text-slate-400">Tokens</TableHead>
                  <TableHead className="text-slate-400">Risk Score</TableHead>
                  <TableHead className="text-slate-400">Flag Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.interactions ?? []).map((interaction) => (
                  <TableRow
                    key={interaction.id}
                    className={
                      interaction.flagged
                        ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10'
                        : 'border-slate-800/50 hover:bg-slate-800/30'
                    }
                  >
                    <TableCell className="text-slate-400 text-xs whitespace-nowrap">
                      {timeAgo(interaction.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span className="text-violet-400 font-medium text-sm">
                        {interaction.agent.name}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-2">
                        {interaction.flagged && (
                          <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                        )}
                        <span className="text-slate-300 text-sm truncate">
                          {interaction.prompt.slice(0, 80)}
                          {interaction.prompt.length > 80 ? '…' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-400 text-xs font-mono bg-slate-800 px-2 py-0.5 rounded">
                        {interaction.model}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm font-mono">
                      {interaction.tokensUsed.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <RiskBadge score={interaction.riskScore} />
                    </TableCell>
                    <TableCell className="text-xs max-w-[200px]">
                      {interaction.flagReason ? (
                        <span className="text-red-400">{interaction.flagReason}</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              Page {data.pagination.page} of {data.pagination.pages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
                className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

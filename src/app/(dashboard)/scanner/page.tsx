'use client'

import { useState } from 'react'
import { Shield } from 'lucide-react'
import { toast } from 'sonner'

interface ShadowAiTool {
  id: string
  name: string
  category: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  riskScore: number
  dataRisk: string
  domains: string[]
  vendor: string
}

interface ScanResult {
  companyName: string
  detectedTools: ShadowAiTool[]
  summary: {
    totalDetected: number
    criticalCount: number
    highCount: number
    mediumCount: number
    lowCount: number
    overallRiskScore: number
    overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }
  scannedAt: string
}

const getRiskColorClasses = (level: string) => {
  switch (level) {
    case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30'
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
}

export default function ScannerPage() {
  const [viewState, setViewState] = useState<'form' | 'loading' | 'results'>('form')
  const [companyName, setCompanyName] = useState('')
  const [toolsInput, setToolsInput] = useState('')
  const [results, setResults] = useState<ScanResult | null>(null)

  const handleScan = async () => {
    if (!companyName.trim()) {
      toast.error('Please enter a company name')
      return
    }
    
    // Parse tools by commas or new lines, remove empty
    const toolsList = toolsInput.split(/[\n,]+/).map(t => t.trim()).filter(Boolean)
    if (toolsList.length === 0) {
      toast.error('Please enter at least one tool')
      return
    }

    setViewState('loading')
    
    try {
      const res = await fetch('/api/scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, tools: toolsList })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan tools')
      }
      
      setResults(data)
      setViewState('results')
    } catch (err: any) {
      toast.error(err.message)
      setViewState('form')
    }
  }

  const resetForm = () => {
    setViewState('form')
    setResults(null)
    setToolsInput('')
  }

  if (viewState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mb-4"></div>
        <p className="text-slate-400">Scanning...</p>
      </div>
    )
  }

  if (viewState === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Scan Results &mdash; {results.companyName}</h1>
              <p className="text-slate-400 text-sm mt-1">
                Scanned at: {new Date(results.scannedAt).toLocaleString()}
              </p>
            </div>
            <button 
              onClick={resetForm}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Scan Again
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <p className="text-slate-400 text-sm mb-2">Overall Risk Score</p>
              <div className={`text-4xl font-bold ${results.summary.overallRiskScore >= 80 ? 'text-red-500' : results.summary.overallRiskScore >= 60 ? 'text-orange-500' : results.summary.overallRiskScore >= 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                {results.summary.overallRiskScore}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <p className="text-slate-400 text-sm mb-2">Critical</p>
              <div className="text-4xl font-bold text-red-500">{results.summary.criticalCount}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <p className="text-slate-400 text-sm mb-2">High</p>
              <div className="text-4xl font-bold text-orange-500">{results.summary.highCount}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <p className="text-slate-400 text-sm mb-2">Medium</p>
              <div className="text-4xl font-bold text-yellow-500">{results.summary.mediumCount}</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className={`px-6 py-2 rounded-full border font-bold tracking-wide ${getRiskColorClasses(results.summary.overallRiskLevel)}`}>
              OVERALL RISK: {results.summary.overallRiskLevel}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Detected Tools ({results.summary.totalDetected})</h2>
            
            {results.detectedTools.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 flex items-center justify-center">
                <p className="text-slate-400 text-lg">No known Shadow AI tools detected</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.detectedTools.map((tool) => (
                  <div key={tool.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold text-lg">{tool.name}</h3>
                        <p className="text-slate-400 text-sm">{tool.vendor}</p>
                      </div>
                      <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                        {tool.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs px-2 py-1 rounded font-mono font-medium border ${getRiskColorClasses(tool.riskLevel)}`}>
                        {tool.riskLevel}
                      </span>
                      <span className="text-slate-300 text-sm">
                        Risk Score: {tool.riskScore}/100
                      </span>
                    </div>
                    
                    <div className="mt-2 pt-3 border-t border-slate-800/50">
                      <p className="text-slate-400 text-sm">{tool.dataRisk}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    )
  }

  // Form State (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col items-center pt-20">
      <div className="max-w-xl w-full space-y-8">
        
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-violet-500/20 rounded-2xl border border-violet-500/30">
              <Shield className="h-8 w-8 text-violet-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Shadow AI Scanner</h1>
          <p className="text-slate-400">Discover unauthorized AI tools in your organization</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-300">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tools" className="block text-sm font-medium text-slate-300">
              AI Tools Detected
            </label>
            <textarea
              id="tools"
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              placeholder="Enter tool names separated by commas or new lines&#10;e.g. ChatGPT, Grammarly, Notion AI, Copilot"
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleScan}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-violet-500/20"
          >
            Run Scan
          </button>
        </div>
        
      </div>
    </div>
  )
}

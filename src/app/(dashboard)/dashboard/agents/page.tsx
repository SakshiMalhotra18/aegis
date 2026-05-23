"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Bot, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentDialog } from "@/components/agents/agent-dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RISK_STYLE: Record<string, string> = {
  LOW:      "badge-risk-low",
  MEDIUM:   "badge-risk-medium",
  HIGH:     "badge-risk-high",
  CRITICAL: "badge-risk-critical",
};

const STATUS_STYLE: Record<string, string> = {
  ACTIVE:   "badge-status-active",
  INACTIVE: "badge-status-inactive",
  ERROR:    "badge-status-error",
};

export default function AgentsPage() {
  const qc = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null);

  const { data: agents = [], isLoading } = useQuery<any[]>({
    queryKey: ["agents"],
    queryFn: () => fetch("/api/agents").then(r => r.json()),
  });

  const safeAgents = Array.isArray(agents) ? agents : [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/agents/${id}`, { method: "DELETE" }).then(r => { if (!r.ok) throw new Error("Delete failed"); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["agents"] }); setIsDeleteDialogOpen(false); setDeletingAgentId(null); },
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="page-header">
          <h1>AI Agents</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.52 0.02 255)" }}>
            Manage and monitor all registered AI agents
          </p>
        </div>
        <button
          onClick={() => { setEditingAgent(null); setIsDialogOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, oklch(0.46 0.18 255), oklch(0.55 0.15 200))",
            color: "white",
            boxShadow: "0 2px 8px oklch(0.46 0.18 255 / 35%)",
          }}
        >
          <Plus size={16} /> Add Agent
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3">
        {["ACTIVE", "HIGH", "CRITICAL"].map((label, i) => {
          const counts = [
            safeAgents.filter(a => a.status === "ACTIVE").length,
            safeAgents.filter(a => a.riskLevel === "HIGH").length,
            safeAgents.filter(a => a.riskLevel === "CRITICAL").length,
          ];
          const styles = [
            { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
            { bg: "#fff7ed", color: "#9a3412", border: "#fed7aa" },
            { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
          ];
          const labels = ["Active Agents", "High Risk", "Critical"];
          return (
            <div key={label} className="px-4 py-2 rounded-xl text-sm font-medium border"
              style={{ background: styles[i].bg, color: styles[i].color, borderColor: styles[i].border }}>
              {counts[i]} {labels[i]}
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="aegis-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "oklch(0.46 0.18 255)", borderTopColor: "transparent" }} />
              <p className="text-sm" style={{ color: "oklch(0.52 0.02 255)" }}>Loading agents…</p>
            </div>
          </div>
        ) : safeAgents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "oklch(0.95 0.01 247)" }}>
              <Bot size={22} style={{ color: "oklch(0.52 0.02 255)" }} />
            </div>
            <p className="font-medium text-sm" style={{ color: "oklch(0.25 0.015 255)" }}>No agents yet</p>
            <p className="text-xs" style={{ color: "oklch(0.55 0.02 255)" }}>Add your first AI agent to get started</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.93 0.006 247)", background: "oklch(0.98 0.003 247)" }}>
                {["Agent", "Model", "Status", "Risk Level", "Blast Radius", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.52 0.02 255)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safeAgents.map((agent: any, i: number) => (
                <tr key={agent.id}
                  style={{
                    borderBottom: i < safeAgents.length - 1 ? "1px solid oklch(0.95 0.004 247)" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.985 0.003 247)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "oklch(0.93 0.03 255)" }}>
                        <Bot size={15} style={{ color: "oklch(0.46 0.18 255)" }} />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "oklch(0.2 0.015 255)" }}>{agent.name}</p>
                        {agent.description && (
                          <p className="text-xs truncate max-w-[180px]" style={{ color: "oklch(0.55 0.02 255)" }}>{agent.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "oklch(0.4 0.02 255)" }}>{agent.model}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[agent.status] ?? "badge-status-inactive"}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {(agent.riskLevel === "HIGH" || agent.riskLevel === "CRITICAL") && (
                        <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
                      )}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${RISK_STYLE[agent.riskLevel] ?? "badge-risk-low"}`}>
                        {agent.riskLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-xs" style={{ color: "oklch(0.35 0.02 255)" }}>
                    {agent.blastRadius}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingAgent(agent); setIsDialogOpen(true); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: "oklch(0.95 0.01 247)", color: "oklch(0.45 0.02 255)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "oklch(0.93 0.03 255)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.46 0.18 255)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "oklch(0.95 0.01 247)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.45 0.02 255)"; }}>
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => { setDeletingAgentId(agent.id); setIsDeleteDialogOpen(true); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: "#fef2f2", color: "#dc2626" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fee2e2"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fef2f2"; }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} agent={editingAgent} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this agent?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the agent and all associated policies, approvals, and audit logs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingAgentId && deleteMutation.mutate(deletingAgentId)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700">
              {deleteMutation.isPending ? "Deleting…" : "Delete Agent"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

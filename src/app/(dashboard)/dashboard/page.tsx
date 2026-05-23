"use client";

import { useQuery } from "@tanstack/react-query";
import { Bot, Shield, CheckCircle, FileText, AlertTriangle, TrendingUp, Activity } from "lucide-react";

function StatCard({
  label, value, sub, icon: Icon, color, bgColor,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; bgColor: string;
}) {
  return (
    <div className="stat-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "oklch(0.52 0.02 255)" }}>{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bgColor }}>
          <Icon size={17} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight" style={{ color: "oklch(0.18 0.015 255)" }}>{value}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: "oklch(0.52 0.02 255)" }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: agents = [] } = useQuery<any[]>({
    queryKey: ["agents"],
    queryFn: () => fetch("/api/agents").then(r => r.json()),
  });

  const { data: policies = [] } = useQuery<any[]>({
    queryKey: ["policies"],
    queryFn: () => fetch("/api/policies").then(r => r.json()),
  });

  const { data: approvals = [] } = useQuery<any[]>({
    queryKey: ["approvals"],
    queryFn: () => fetch("/api/approvals").then(r => r.json()),
  });

  const { data: auditLogs = [] } = useQuery<any[]>({
    queryKey: ["audit"],
    queryFn: () => fetch("/api/audit").then(r => r.json()),
  });

  const safeAgents   = Array.isArray(agents)   ? agents   : [];
  const safePolicies = Array.isArray(policies)  ? policies : [];
  const safeApprovals= Array.isArray(approvals) ? approvals: [];
  const safeLogs     = Array.isArray(auditLogs) ? auditLogs: [];

  const highRisk  = safeAgents.filter(a => a.riskLevel === "HIGH" || a.riskLevel === "CRITICAL").length;
  const pending   = safeApprovals.filter(a => a.status === "PENDING").length;
  const recentLogs = safeLogs.slice(0, 5);

  return (
    <div className="flex flex-col gap-8 max-w-6xl">

      {/* Page Header */}
      <div className="page-header">
        <h1>Platform Overview</h1>
        <p className="text-sm mt-1" style={{ color: "oklch(0.52 0.02 255)" }}>
          Real-time visibility into your AI agent governance posture
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Agents"
          value={safeAgents.length}
          sub="Across all environments"
          icon={Bot}
          color="oklch(0.46 0.18 255)"
          bgColor="oklch(0.93 0.03 255)"
        />
        <StatCard
          label="Active Policies"
          value={safePolicies.filter(p => p.status === "ACTIVE").length}
          sub={`of ${safePolicies.length} total`}
          icon={Shield}
          color="oklch(0.55 0.15 200)"
          bgColor="oklch(0.93 0.04 200)"
        />
        <StatCard
          label="High Risk Agents"
          value={highRisk}
          sub="Require immediate review"
          icon={AlertTriangle}
          color="oklch(0.577 0.245 27)"
          bgColor="oklch(0.97 0.04 27)"
        />
        <StatCard
          label="Pending Approvals"
          value={pending}
          sub="Awaiting your action"
          icon={CheckCircle}
          color="oklch(0.55 0.18 145)"
          bgColor="oklch(0.95 0.04 145)"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 aegis-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={16} style={{ color: "oklch(0.46 0.18 255)" }} />
            <h2 className="font-semibold text-sm" style={{ color: "oklch(0.18 0.015 255)" }}>Recent Audit Events</h2>
          </div>
          {recentLogs.length === 0 ? (
            <div className="py-10 text-center text-sm" style={{ color: "oklch(0.52 0.02 255)" }}>
              No audit events yet
            </div>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: "oklch(0.94 0.005 247)" }}>
              {recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 py-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                    style={{ background: "oklch(0.93 0.03 255)", color: "oklch(0.46 0.18 255)" }}>
                    {log.action?.[0] ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "oklch(0.25 0.015 255)" }}>{log.message}</p>
                    <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.02 255)" }}>
                      {log.agent?.name ?? "System"} · {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: "oklch(0.93 0.03 255)", color: "oklch(0.46 0.18 255)" }}>
                    {log.action}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Risk Breakdown */}
        <div className="aegis-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} style={{ color: "oklch(0.46 0.18 255)" }} />
            <h2 className="font-semibold text-sm" style={{ color: "oklch(0.18 0.015 255)" }}>Agent Risk Breakdown</h2>
          </div>
          {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map(level => {
            const count = safeAgents.filter(a => a.riskLevel === level).length;
            const total = safeAgents.length || 1;
            const pct = Math.round((count / total) * 100);
            const colors: Record<string, { bar: string; text: string; bg: string }> = {
              CRITICAL: { bar: "#ef4444", text: "#991b1b", bg: "#fef2f2" },
              HIGH:     { bar: "#f97316", text: "#9a3412", bg: "#fff7ed" },
              MEDIUM:   { bar: "#eab308", text: "#92400e", bg: "#fffbeb" },
              LOW:      { bar: "#22c55e", text: "#166534", bg: "#f0fdf4" },
            };
            return (
              <div key={level} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: colors[level].bg, color: colors[level].text }}>
                    {level}
                  </span>
                  <span className="text-xs font-medium" style={{ color: "oklch(0.45 0.02 255)" }}>{count} agents</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "oklch(0.94 0.005 247)" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: colors[level].bar }} />
                </div>
              </div>
            );
          })}

          {/* Pending approvals callout */}
          {pending > 0 && (
            <div className="mt-6 p-3 rounded-xl border text-sm"
              style={{ background: "oklch(0.97 0.02 27)", borderColor: "oklch(0.9 0.06 27)", color: "oklch(0.45 0.15 27)" }}>
              <p className="font-semibold">⚠ {pending} pending approval{pending > 1 ? "s" : ""}</p>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.5 0.1 27)" }}>Head to Approvals to action them</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

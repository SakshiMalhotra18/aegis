"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, CheckCircle2, Clock } from "lucide-react";

type Approval = {
  id: string; status: string; reason: string | null; createdAt: string;
  agent: { name: string } | null; user: { email: string } | null;
};

export default function ApprovalsPage() {
  const qc = useQueryClient();

  const { data: raw = [], isLoading } = useQuery<any>({
    queryKey: ["approvals"],
    queryFn: () => fetch("/api/approvals").then(r => r.json()),
  });

  const approvals: Approval[] = Array.isArray(raw) ? raw : [];

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetch(`/api/approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["approvals"] }),
  });

  const pending  = approvals.filter(a => a.status === "PENDING");
  const resolved = approvals.filter(a => a.status !== "PENDING");

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: "oklch(0.46 0.18 255)", borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="page-header">
          <h1>Approval Queue</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.52 0.02 255)" }}>
            Review and action pending AI agent requests
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl text-sm font-medium border"
            style={{ background: "#fffbeb", color: "#92400e", borderColor: "#fde68a" }}>
            {pending.length} Pending
          </div>
          <div className="px-4 py-2 rounded-xl text-sm font-medium border"
            style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}>
            {resolved.length} Resolved
          </div>
        </div>
      </div>

      {/* Pending Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={15} style={{ color: "oklch(0.55 0.12 80)" }} />
          <h2 className="text-sm font-semibold" style={{ color: "oklch(0.25 0.015 255)" }}>
            Pending Review
          </h2>
          {pending.length > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#fef3c7", color: "#92400e" }}>{pending.length}</span>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="aegis-card flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "#f0fdf4" }}>
              <CheckCircle2 size={22} style={{ color: "#22c55e" }} />
            </div>
            <p className="font-semibold text-sm" style={{ color: "oklch(0.25 0.015 255)" }}>All caught up!</p>
            <p className="text-xs" style={{ color: "oklch(0.55 0.02 255)" }}>No pending approvals at this time</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map(a => (
              <div key={a.id} className="aegis-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.93 0.03 255)" }}>
                      <span className="text-sm font-bold" style={{ color: "oklch(0.46 0.18 255)" }}>
                        {a.agent?.name?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold" style={{ color: "oklch(0.18 0.015 255)" }}>
                        {a.agent?.name ?? "Unknown Agent"}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: "oklch(0.45 0.02 255)" }}>
                        {a.reason ?? "No reason provided"}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs" style={{ color: "oklch(0.6 0.02 255)" }}>
                          Requested by {a.user?.email ?? "unknown"}
                        </span>
                        <span className="text-xs" style={{ color: "oklch(0.7 0.01 255)" }}>·</span>
                        <span className="text-xs" style={{ color: "oklch(0.6 0.02 255)" }}>
                          {new Date(a.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => mutation.mutate({ id: a.id, status: "APPROVED" })}
                      disabled={mutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
                      style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#dcfce7")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#f0fdf4")}
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => mutation.mutate({ id: a.id, status: "REJECTED" })}
                      disabled={mutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
                      style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#fef2f2")}
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Section */}
      {resolved.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={15} style={{ color: "oklch(0.55 0.15 145)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "oklch(0.25 0.015 255)" }}>
              Resolved
            </h2>
          </div>
          <div className="aegis-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.93 0.006 247)", background: "oklch(0.98 0.003 247)" }}>
                  {["Agent", "Action Requested", "Decision", "Date"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "oklch(0.52 0.02 255)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resolved.map((a, i) => (
                  <tr key={a.id}
                    style={{ borderBottom: i < resolved.length - 1 ? "1px solid oklch(0.95 0.004 247)" : "none" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.985 0.003 247)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-3.5 font-semibold" style={{ color: "oklch(0.2 0.015 255)" }}>
                      {a.agent?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs max-w-xs truncate" style={{ color: "oklch(0.45 0.02 255)" }}>
                      {a.reason ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.status === "APPROVED" ? "badge-status-active" : "badge-risk-high"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "oklch(0.52 0.02 255)" }}>
                      {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

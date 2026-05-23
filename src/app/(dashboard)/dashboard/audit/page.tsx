"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";

export default function AuditPage() {
  const { data: rawLogs = [], isLoading } = useQuery<any[]>({
    queryKey: ["audit"],
    queryFn: () => fetch("/api/audit").then(r => r.json()),
  });

  const logs = Array.isArray(rawLogs) ? rawLogs : [];

  const [actionFilter, setActionFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const filtered = logs.filter((log: any) => {
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesSearch = !search ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.agent?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesDateFrom = !dateFrom || new Date(log.createdAt) >= new Date(dateFrom);
    const matchesDateTo = !dateTo || new Date(log.createdAt) <= new Date(dateTo);
    return matchesAction && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: "oklch(0.46 0.18 255)", borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="page-header">
          <h1>Audit Log</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.52 0.02 255)" }}>
            Track changes and activities across agents, policies, and approvals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="rounded-md px-2 py-1 text-sm"
            style={{ border: "1px solid oklch(0.92 0.005 247)", background: "oklch(0.985 0.003 247)" }}
          >
            <option value="all">All Actions</option>
            <option value="CREATED">Created</option>
            <option value="UPDATED">Updated</option>
            <option value="DELETED">Deleted</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            placeholder="From"
            className="rounded-md px-2 py-1 text-sm"
            style={{ border: "1px solid oklch(0.92 0.005 247)", background: "oklch(0.985 0.003 247)" }}
          />
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            placeholder="To"
            className="rounded-md px-2 py-1 text-sm"
            style={{ border: "1px solid oklch(0.92 0.005 247)", background: "oklch(0.985 0.003 247)" }}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="rounded-md px-2 py-1 text-sm"
            style={{ border: "1px solid oklch(0.92 0.005 247)", background: "oklch(0.985 0.003 247)" }}
          />
        </div>
      </div>

      {/* Log Table */}
      <div className="aegis-card overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Clock size={32} style={{ color: "oklch(0.55 0.12 80)" }} />
            <p className="font-medium text-sm" style={{ color: "oklch(0.25 0.015 255)" }}>No matching events</p>
            <p className="text-xs" style={{ color: "oklch(0.55 0.02 255)" }}>Try adjusting the filters or date range.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.93 0.006 247)", background: "oklch(0.98 0.003 247)" }}>
                {["Timestamp", "Action", "Agent", "User", "Details"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.52 0.02 255)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log: any, i: number) => (
                <tr key={log.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid oklch(0.95 0.004 247)" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.985 0.003 247)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-3.5" style={{ color: "oklch(0.45 0.02 255)" }}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-3.5 font-medium" style={{ color: "oklch(0.18 0.015 255)" }}>{log.action}</td>
                  <td className="px-5 py-3.5" style={{ color: "oklch(0.45 0.02 255)" }}>{log.agent?.name ?? "—"}</td>
                  <td className="px-5 py-3.5" style={{ color: "oklch(0.45 0.02 255)" }}>{log.user?.email ?? "—"}</td>
                  <td className="px-5 py-3.5" style={{ color: "oklch(0.55 0.02 255)" }}>{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

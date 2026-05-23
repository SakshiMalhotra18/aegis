"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import { PolicyDialog } from "@/components/policies/policy-dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PoliciesPage() {
  const qc = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: policies = [], isLoading } = useQuery<any[]>({
    queryKey: ["policies"],
    queryFn: () => fetch("/api/policies").then(r => r.json()),
  });

  const safePolicies = Array.isArray(policies) ? policies : [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/policies/${id}`, { method: "DELETE" }).then(r => { if (!r.ok) throw new Error("Delete failed"); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["policies"] }); setIsDeleteOpen(false); setDeletingId(null); },
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="page-header">
          <h1>Governance Policies</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.52 0.02 255)" }}>
            Define and enforce rules across your AI agents
          </p>
        </div>
        <button
          onClick={() => { setEditingPolicy(null); setIsDialogOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, oklch(0.46 0.18 255), oklch(0.55 0.15 200))",
            color: "white",
            boxShadow: "0 2px 8px oklch(0.46 0.18 255 / 35%)",
          }}
        >
          <Plus size={16} /> New Policy
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-3">
        {[
          { label: "Active", color: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" }, count: safePolicies.filter(p => p.status === "ACTIVE").length },
          { label: "Disabled", color: { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" }, count: safePolicies.filter(p => p.status === "DISABLED").length },
        ].map(s => (
          <div key={s.label} className="px-4 py-2 rounded-xl text-sm font-medium border"
            style={{ background: s.color.bg, color: s.color.text, borderColor: s.color.border }}>
            {s.count} {s.label}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="aegis-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{ borderColor: "oklch(0.46 0.18 255)", borderTopColor: "transparent" }} />
          </div>
        ) : safePolicies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "oklch(0.95 0.01 247)" }}>
              <Shield size={22} style={{ color: "oklch(0.52 0.02 255)" }} />
            </div>
            <p className="font-medium text-sm" style={{ color: "oklch(0.25 0.015 255)" }}>No policies yet</p>
            <p className="text-xs" style={{ color: "oklch(0.55 0.02 255)" }}>Create your first governance policy</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.93 0.006 247)", background: "oklch(0.98 0.003 247)" }}>
                {["Policy", "Linked Agent", "Status", "Created", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.52 0.02 255)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safePolicies.map((policy: any, i: number) => (
                <tr key={policy.id}
                  style={{ borderBottom: i < safePolicies.length - 1 ? "1px solid oklch(0.95 0.004 247)" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.985 0.003 247)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "oklch(0.93 0.04 200)" }}>
                        <Shield size={15} style={{ color: "oklch(0.55 0.15 200)" }} />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "oklch(0.2 0.015 255)" }}>{policy.name}</p>
                        <p className="text-xs truncate max-w-[240px]" style={{ color: "oklch(0.55 0.02 255)" }}>{policy.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {policy.agent?.name ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: "oklch(0.93 0.03 255)", color: "oklch(0.46 0.18 255)" }}>
                        {policy.agent.name}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "oklch(0.6 0.01 255)" }}>—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${policy.status === "ACTIVE" ? "badge-status-active" : "badge-status-inactive"}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "oklch(0.52 0.02 255)" }}>
                    {new Date(policy.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingPolicy(policy); setIsDialogOpen(true); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "oklch(0.95 0.01 247)", color: "oklch(0.45 0.02 255)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "oklch(0.93 0.03 255)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.46 0.18 255)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "oklch(0.95 0.01 247)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.45 0.02 255)"; }}>
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => { setDeletingId(policy.id); setIsDeleteOpen(true); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
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

      <PolicyDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} policy={editingPolicy} />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this policy?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the policy. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700">
              {deleteMutation.isPending ? "Deleting…" : "Delete Policy"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

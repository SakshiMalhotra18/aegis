"use client";

import { useQuery } from "@tanstack/react-query";
import { Bot, ShieldCheck, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchAgents = async () => {
  const res = await fetch("/api/agents");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const fetchPolicies = async () => {
  const res = await fetch("/api/policies");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const fetchApprovals = async () => {
  const res = await fetch("/api/approvals");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const fetchAudit = async () => {
  const res = await fetch("/api/audit");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export function StatsCards() {
  const { data: agents, isLoading: loadingAgents, isError: errAgents } = useQuery({ queryKey: ["agents"], queryFn: fetchAgents, retry: 1 });
  const { data: policies, isLoading: loadingPolicies, isError: errPolicies } = useQuery({ queryKey: ["policies"], queryFn: fetchPolicies, retry: 1 });
  const { data: approvals, isLoading: loadingApprovals, isError: errApprovals } = useQuery({ queryKey: ["approvals"], queryFn: fetchApprovals, retry: 1 });
  const { data: audit, isLoading: loadingAudit, isError: errAudit } = useQuery({ queryKey: ["audit"], queryFn: fetchAudit, retry: 1 });

  // Calculate stats based on requirements
  const totalAgents = errAgents ? 0 : (agents?.length || 0);
  const activePolicies = errPolicies ? 0 : (policies?.filter((p: any) => p.status === "ACTIVE").length || 0);
  const pendingApprovals = errApprovals ? 0 : (approvals?.filter((a: any) => a.status === "PENDING").length || 0);
  
  const today = new Date().toISOString().split("T")[0];
  const auditToday = errAudit ? 0 : (audit?.filter((a: any) => a.createdAt?.startsWith(today)).length || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
          <Bot className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loadingAgents ? <span className="animate-pulse bg-gray-200 text-transparent rounded">000</span> : totalAgents}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
          <ShieldCheck className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loadingPolicies ? <span className="animate-pulse bg-gray-200 text-transparent rounded">000</span> : activePolicies}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          <Clock className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loadingApprovals ? <span className="animate-pulse bg-gray-200 text-transparent rounded">000</span> : pendingApprovals}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Audit Events Today</CardTitle>
          <Activity className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loadingAudit ? <span className="animate-pulse bg-gray-200 text-transparent rounded">000</span> : auditToday}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

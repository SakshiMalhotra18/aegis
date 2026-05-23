"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PolicyDialog({
  open,
  onOpenChange,
  policy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy?: any;
}) {
  const queryClient = useQueryClient();
  const isEditing = !!policy;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [agentId, setAgentId] = useState("");

  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await fetch("/api/agents");
      if (!res.ok) throw new Error("Failed to fetch agents");
      return res.json();
    },
  });

  useEffect(() => {
    if (open) {
      if (policy) {
        setName(policy.name || "");
        setDescription(policy.description || "");
        setRules(policy.rules || "");
        setStatus(policy.status || "ACTIVE");
        setAgentId(policy.agentId || "");
      } else {
        setName("");
        setDescription("");
        setRules("");
        setStatus("ACTIVE");
        setAgentId("");
      }
    }
  }, [open, policy]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const method = isEditing ? "PATCH" : "POST";
      const url = isEditing ? `/api/policies/${policy.id}` : "/api/policies";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save policy");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      description,
      rules,
      status,
      agentId: agentId || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Policy" : "Create New Policy"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. No External Email Policy"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Rules</label>
            <Textarea
              required
              rows={5}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Describe this policy in plain English. Example: This agent must never access payroll data or send emails to external addresses without human approval."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(val) => setStatus(val || "ACTIVE")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="DISABLED">DISABLED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Linked Agent</label>
            <Select value={agentId} onValueChange={(val) => setAgentId(val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="None (Global Policy)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (Global Policy)</SelectItem>
                {agents.map((agent: any) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Policy"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

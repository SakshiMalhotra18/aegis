"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AgentDialog({ open, onOpenChange, agent }: { open: boolean, onOpenChange: (open: boolean) => void, agent?: any }) {
  const queryClient = useQueryClient();
  const isEditing = !!agent;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [riskLevel, setRiskLevel] = useState("LOW");
  const [blastRadius, setBlastRadius] = useState("1");

  useEffect(() => {
    if (open) {
      if (agent) {
        setName(agent.name || "");
        setDescription(agent.description || "");
        setModel(agent.model || "");
        setStatus(agent.status || "ACTIVE");
        setRiskLevel(agent.riskLevel || "LOW");
        setBlastRadius(agent.blastRadius?.toString() || "1");
      } else {
        setName("");
        setDescription("");
        setModel("");
        setStatus("ACTIVE");
        setRiskLevel("LOW");
        setBlastRadius("1");
      }
    }
  }, [open, agent]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const method = isEditing ? "PATCH" : "POST";
      const url = isEditing ? `/api/agents/${agent.id}` : "/api/agents";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save agent");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      onOpenChange(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      description,
      model,
      status,
      riskLevel,
      blastRadius: parseInt(blastRadius, 10) || 1,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Agent" : "Create New Agent"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input 
              required
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Sales Assistant" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Model</label>
            <Select value={model} onValueChange={(val) => setModel(val || "")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="claude-sonnet-4-5">Claude Sonnet 4.5</SelectItem>
                <SelectItem value="gemini-3-pro">Gemini 3 Pro</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(val) => setStatus(val || "ACTIVE")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Risk Level</label>
            <Select value={riskLevel} onValueChange={(val) => setRiskLevel(val || "LOW")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">LOW</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="CRITICAL">CRITICAL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Blast Radius</label>
            <Input 
              type="number" 
              required 
              min={1} 
              max={100} 
              value={blastRadius} 
              onChange={(e) => setBlastRadius(e.target.value)} 
              placeholder="1-100" 
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Agent"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

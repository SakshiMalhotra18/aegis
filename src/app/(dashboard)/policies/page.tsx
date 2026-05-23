"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PolicyDialog } from "@/components/policies/policy-dialog";

export default function PoliciesPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPolicyId, setDeletingPolicyId] = useState<string | null>(null);

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ["policies"],
    queryFn: async () => {
      const res = await fetch("/api/policies");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await fetch("/api/agents");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/policies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      setIsDeleteDialogOpen(false);
      setDeletingPolicyId(null);
    },
  });

  const getAgentName = (agentId: string | null) => {
    if (!agentId) return "None";
    const agent = agents.find((a: any) => a.id === agentId);
    return agent?.name || "None";
  };

  const handleEdit = (policy: any) => {
    setEditingPolicy(policy);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingPolicyId(id);
    setIsDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingPolicy(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policies</h1>
          <p className="text-muted-foreground">Define governance rules for your AI agents</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Create Policy
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rules Preview</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Linked Agent</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading policies...
                </TableCell>
              </TableRow>
            ) : policies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No policies found.
                </TableCell>
              </TableRow>
            ) : (
              policies.map((policy: any) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.name}</TableCell>
                  <TableCell className="max-w-[220px] text-muted-foreground text-sm">
                    {policy.rules?.length > 60
                      ? policy.rules.slice(0, 60) + "..."
                      : policy.rules}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={policy.status === "ACTIVE" ? "default" : "secondary"}
                      className={policy.status === "ACTIVE" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{getAgentName(policy.agentId)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(policy.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(policy)}>
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(policy.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PolicyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        policy={editingPolicy}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this policy and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingPolicyId && deleteMutation.mutate(deletingPolicyId)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

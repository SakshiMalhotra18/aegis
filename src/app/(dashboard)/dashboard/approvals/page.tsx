"use client"
import { useQuery, useMutation, useQueryClient }
  from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger }
  from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, CheckCircle2 } from "lucide-react"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"

type Approval = {
  id: string
  status: string
  reason: string
  createdAt: string
  agent: { name: string } | null
  user: { email: string } | null
}

export default function ApprovalsPage() {
  const queryClient = useQueryClient()

  const { data: approvals = [], isLoading } =
    useQuery<Approval[]>({
      queryKey: ["approvals"],
      queryFn: () =>
        fetch("/api/approvals").then(r => r.json())
    })

  const mutation = useMutation({
    mutationFn: ({id, status}: 
      {id: string, status: string}) =>
      fetch(`/api/approvals/${id}`, {
        method: "PATCH",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ status })
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["approvals"]
      })
  })

  const pending = Array.isArray(approvals) ? approvals.filter(a => a.status === "PENDING") : []
  const resolved = Array.isArray(approvals) ? approvals.filter(a => a.status !== "PENDING") : []

  if (isLoading) return (
    <div className="p-6">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Approval Queue
        </h1>
        <p className="text-muted-foreground">
          Review and action pending agent requests
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pending.length > 0 && (
              <Badge className="ml-2 h-5 px-1.5
                text-xs" variant="destructive">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending"
          className="space-y-4 mt-4">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center
              justify-center py-16 text-center">
              <CheckCircle2 className="h-12 w-12
                text-muted-foreground mb-4"/>
              <p className="font-medium">
                No pending approvals
              </p>
              <p className="text-sm
                text-muted-foreground">
                All caught up!
              </p>
            </div>
          ) : (
            pending.map(approval => (
              <Card key={approval.id}>
                <CardContent className="p-4">
                  <div className="flex items-center
                    justify-between mb-2">
                    <p className="font-semibold">
                      {approval.agent?.name ?? 
                        "Unknown Agent"}
                    </p>
                    <p className="text-xs
                      text-muted-foreground">
                      {new Date(approval.createdAt)
                        .toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm
                    text-muted-foreground mb-4">
                    Action: {approval.reason}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"
                      className="text-green-600
                        border-green-600
                        hover:bg-green-50"
                      onClick={() => mutation.mutate({
                        id: approval.id,
                        status: "APPROVED"
                      })}>
                      <Check className="h-4 w-4 mr-1"/>
                      Approve
                    </Button>
                    <Button size="sm"
                      variant="destructive"
                      onClick={() => mutation.mutate({
                        id: approval.id,
                        status: "REJECTED"
                      })}>
                      <X className="h-4 w-4 mr-1"/>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resolved At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resolved.map(approval => (
                <TableRow key={approval.id}>
                  <TableCell className="font-medium">
                    {approval.agent?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm
                    text-muted-foreground">
                    {approval.reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      approval.status === "APPROVED"
                        ? "default"
                        : "destructive"
                    }>
                      {approval.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm
                    text-muted-foreground">
                    {new Date(approval.createdAt)
                      .toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

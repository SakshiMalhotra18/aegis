"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"

type AuditLog = {
  id: string
  action: string
  message: string
  createdAt: string
  agent: { name: string } | null
  user: { email: string } | null
}

const ACTION_COLORS: Record<string, string> = {
  CREATED:   "bg-blue-100 text-blue-800",
  UPDATED:   "bg-yellow-100 text-yellow-800",
  DELETED:   "bg-red-100 text-red-800",
  APPROVED:  "bg-green-100 text-green-800",
  REJECTED:  "bg-red-100 text-red-800",
  TRIGGERED: "bg-purple-100 text-purple-800",
}

const PAGE_SIZE = 20

export default function AuditPage() {
  const [actionFilter, setActionFilter] =
    useState("all")
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)

  const { data: logs = [], isLoading } =
    useQuery<AuditLog[]>({
      queryKey: ["audit"],
      queryFn: () =>
        fetch("/api/audit").then(r => r.json())
    })

  const filtered = logs
    .filter(l =>
      actionFilter === "all" ||
      l.action === actionFilter)
    .filter(l =>
      l.message.toLowerCase()
        .includes(search.toLowerCase()))
    .filter(l =>
      !dateFrom ||
      new Date(l.createdAt) >= new Date(dateFrom))
    .filter(l =>
      !dateTo ||
      new Date(l.createdAt) <= new Date(dateTo))

  const totalPages = Math.ceil(
    filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const resetPage = () => setPage(1)

  if (isLoading) return (
    <div className="p-6">
      <p className="text-muted-foreground">
        Loading...
      </p>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Audit Log
        </h1>
        <p className="text-muted-foreground">
          Complete history of all governance events
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={actionFilter}
          onValueChange={v => {
            setActionFilter(v ?? "all")
            resetPage()
          }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Actions"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All Actions
            </SelectItem>
            {["CREATED","UPDATED","DELETED",
              "APPROVED","REJECTED","TRIGGERED"]
              .map(a => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by message..."
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            resetPage()
          }}
          className="w-56"
        />

        <Input
          type="date"
          value={dateFrom}
          onChange={e => {
            setDateFrom(e.target.value)
            resetPage()
          }}
          className="w-40"
        />

        <Input
          type="date"
          value={dateTo}
          onChange={e => {
            setDateTo(e.target.value)
            resetPage()
          }}
          className="w-40"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}
                className="text-center py-12
                  text-muted-foreground">
                No audit logs match your filters.
              </TableCell>
            </TableRow>
          ) : (
            paginated.map(log => (
              <TableRow key={log.id}>
                <TableCell className="text-sm
                  text-muted-foreground whitespace-nowrap">
                  {new Date(log.createdAt)
                    .toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded
                    text-xs font-medium
                    ${ACTION_COLORS[log.action] ??
                      "bg-gray-100 text-gray-800"}`}>
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="text-sm
                  max-w-xs truncate">
                  {log.message}
                </TableCell>
                <TableCell className="text-sm">
                  {log.agent?.name ?? "—"}
                </TableCell>
                <TableCell className="text-sm
                  text-muted-foreground">
                  {log.user?.email ?? "System"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center
        justify-between text-sm
        text-muted-foreground">
        <span>
          Showing {Math.min(
            (page-1)*PAGE_SIZE+1, filtered.length
          )}–{Math.min(
            page*PAGE_SIZE, filtered.length
          )} of {filtered.length} events
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"
            onClick={() =>
              setPage(p => Math.max(1, p-1))}
            disabled={page === 1}>
            Previous
          </Button>
          <Button variant="outline" size="sm"
            onClick={() =>
              setPage(p =>
                Math.min(totalPages, p+1))}
            disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

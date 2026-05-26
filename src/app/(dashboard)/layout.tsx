"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Bot, Shield, CheckCircle, FileText,
  ChevronRight, Bell, Settings
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

const NAV_ITEMS = [
  { label: "Dashboard",  route: "/dashboard",           icon: LayoutDashboard },
  { label: "Agents",     route: "/dashboard/agents",    icon: Bot },
  { label: "Policies",   route: "/dashboard/policies",  icon: Shield },
  { label: "Approvals",  route: "/dashboard/approvals", icon: CheckCircle },
  { label: "Audit Logs", route: "/dashboard/audit",     icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const { data: stats } = useQuery<any>({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetch("/api/dashboard/stats").then(r => r.json()),
    refetchInterval: 10000,
  });

  const pendingCount = stats?.pendingApprovals ?? 0;

  const breadcrumb = pathname
    .replace("/dashboard", "")
    .replace("/", "")
    .replace(/\b\w/g, c => c.toUpperCase()) || "Overview";

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans">

      {/* ── Sidebar ── */}
      <aside className="w-[240px] flex flex-col h-screen flex-shrink-0 bg-slate-900 border-r border-slate-800">

        {/* Logo */}
        <div className="px-5 h-16 flex items-center gap-2.5 flex-shrink-0 border-b border-slate-800">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-violet-500 to-indigo-600">
            <Shield size={14} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-100">Aegis</span>
            <span className="block text-[10px] font-semibold text-violet-400 tracking-wider">AI GOVERNANCE</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.route === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.route);
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-violet-600/15 text-violet-400 border-l-2 border-violet-500 pl-2.5 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.label === "Approvals" && pendingCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                    {pendingCount}
                  </span>
                )}
                {isActive && <ChevronRight size={14} className="text-violet-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 flex-shrink-0 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-gradient-to-br from-violet-500 to-indigo-600">
              {session?.user?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-slate-200">
                {session?.user?.name ?? "User"}
              </p>
              <p className="text-[10px] truncate text-slate-400">
                {session?.user?.email ?? ""}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950">

        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-8 flex-shrink-0 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="font-medium text-slate-300">Aegis</span>
            <ChevronRight size={14} />
            <span>{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <Bell size={15} />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <Settings size={15} />
            </button>
            <div className="w-[1px] h-5 bg-slate-800" />
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-900/20"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8 bg-slate-950 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}

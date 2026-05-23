"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Bot, Shield, CheckCircle, FileText,
  ChevronRight, Bell, Settings
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

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

  const breadcrumb = pathname
    .replace("/dashboard", "")
    .replace("/", "")
    .replace(/\b\w/g, c => c.toUpperCase()) || "Overview";

  return (
    <div className="flex h-screen w-full" style={{ background: "oklch(0.975 0.003 247)" }}>

      {/* ── Sidebar ── */}
      <aside className="w-[240px] flex flex-col h-screen flex-shrink-0 bg-white"
        style={{ borderRight: "1px solid oklch(0.9 0.008 247)", boxShadow: "1px 0 0 0 oklch(0.92 0.008 247)" }}>

        {/* Logo */}
        <div className="px-5 h-16 flex items-center gap-2.5 flex-shrink-0"
          style={{ borderBottom: "1px solid oklch(0.93 0.008 247)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, oklch(0.46 0.18 255), oklch(0.55 0.15 200))" }}>
            <Shield size={14} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight" style={{ color: "oklch(0.18 0.015 255)" }}>Aegis</span>
            <span className="block text-[10px] font-medium" style={{ color: "oklch(0.52 0.02 255)", letterSpacing: "0.05em" }}>AI GOVERNANCE</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "oklch(0.65 0.02 255)" }}>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group`}
                style={isActive ? {
                  background: "oklch(0.94 0.03 255)",
                  color: "oklch(0.46 0.18 255)",
                  boxShadow: "inset 3px 0 0 oklch(0.46 0.18 255)",
                } : {
                  color: "oklch(0.45 0.02 255)",
                }}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} style={{ color: "oklch(0.46 0.18 255)" }} />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 flex-shrink-0" style={{ borderTop: "1px solid oklch(0.93 0.008 247)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{ background: "oklch(0.97 0.005 247)" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, oklch(0.46 0.18 255), oklch(0.55 0.15 200))" }}>
              {session?.user?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "oklch(0.25 0.015 255)" }}>
                {session?.user?.name ?? "User"}
              </p>
              <p className="text-[10px] truncate" style={{ color: "oklch(0.55 0.02 255)" }}>
                {session?.user?.email ?? ""}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-8 flex-shrink-0 bg-white"
          style={{ borderBottom: "1px solid oklch(0.9 0.008 247)" }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.52 0.02 255)" }}>
            <span className="font-medium" style={{ color: "oklch(0.35 0.02 255)" }}>Aegis</span>
            <ChevronRight size={14} />
            <span>{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: "oklch(0.97 0.005 247)", color: "oklch(0.45 0.02 255)" }}
            >
              <Bell size={15} />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: "oklch(0.97 0.005 247)", color: "oklch(0.45 0.02 255)" }}
            >
              <Settings size={15} />
            </button>
            <div style={{ width: 1, height: 20, background: "oklch(0.9 0.008 247)" }} />
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
              style={{
                background: "linear-gradient(135deg, oklch(0.46 0.18 255), oklch(0.55 0.15 200))",
                color: "white",
                boxShadow: "0 1px 4px oklch(0.46 0.18 255 / 30%)"
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

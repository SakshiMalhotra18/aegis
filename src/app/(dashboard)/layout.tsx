"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bot, Shield, CheckCircle, FileText } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const NAV_ITEMS = [
  { label: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
  { label: "Agents", route: "/dashboard/agents", icon: Bot },
  { label: "Policies", route: "/dashboard/policies", icon: Shield },
  { label: "Approvals", route: "/dashboard/approvals", icon: CheckCircle },
  { label: "Audit Logs", route: "/dashboard/audit", icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-screen w-full bg-white text-black">
      <aside className="w-[240px] border-r flex flex-col h-screen flex-shrink-0">
        <div className="p-4 h-16 flex items-center border-b">
          <h1 className="font-bold text-xl tracking-tight">Aegis</h1>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.route === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.route);
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6 flex-shrink-0">
          <p className="text-sm text-gray-500">
            {pathname.replace("/dashboard", "").replace("/", " / ") || "Overview"}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session?.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

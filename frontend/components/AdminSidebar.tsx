"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Users,
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Boxes },
  { name: "Orders", href: "/admin/orders", icon: ReceiptText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
];

type AdminSidebarProps = {
  isOpen?: boolean;
  onNavigate?: () => void;
};

export default function AdminSidebar({
  isOpen = false,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className={`fixed inset-y-14 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950 lg:inset-y-0 lg:translate-x-0 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header - Desktop Only */}
      <div className="hidden border-b border-slate-200 px-5 py-6 dark:border-zinc-800 lg:block">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          Admin
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
          Spargen Console
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 lg:space-y-2">
        {links.map(({ name, href, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer - Logout Button */}
      <div className="border-t border-slate-200 p-4 dark:border-zinc-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
}

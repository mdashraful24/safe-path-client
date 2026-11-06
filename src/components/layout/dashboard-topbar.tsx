"use client";

import { Compass, Menu, PlusCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMe } from "@/hooks";

interface DashboardTopbarProps {
  onMobileMenuOpen: () => void;
}

export default function DashboardTopbar({
  onMobileMenuOpen,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const { data } = useGetMe();
  const user = data?.data;

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname === "/dashboard/incidents") return "My Reports";
    if (pathname === "/dashboard/incidents/new") return "Report an Incident";
    if (pathname.startsWith("/dashboard/incidents/")) return "Incident Details";
    if (pathname === "/dashboard/profile") return "Profile & Security";
    if (pathname === "/admin/users") return "User Management";
    if (pathname === "/admin/incidents") return "Incident Queue";
    if (pathname === "/admin/deletion-requests") return "Account Deletion Requests";
    if (pathname === "/admin/change-request") return "Change Requests";
    if (pathname === "/super-admin") return "Super Admin Console";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 transition-all">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuOpen}
          className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {getPageTitle()}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Network
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/incidents"
          className="hidden sm:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <Compass className="size-3.5" />
          <span>Public feed</span>
        </Link>

        <Link
          href="/dashboard/incidents/new"
          className="flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all hover:shadow-md hover:shadow-emerald-500/30"
        >
          <PlusCircle className="size-3.5" />
          <span>Report incident</span>
        </Link>

        {user && (
          <div className="flex size-8 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-emerald-500 text-xs font-bold ring-2 ring-slate-100 dark:ring-slate-800 shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}


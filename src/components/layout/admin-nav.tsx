"use client";

import { GitPullRequest, ShieldAlert, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/incidents", label: "Incidents Queue", icon: ShieldAlert },
  {
    href: "/admin/deletion-requests",
    label: "Deletion Requests",
    icon: Trash2,
  },
  {
    href: "/admin/change-request",
    label: "Change Requests",
    icon: GitPullRequest,
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200",
              isActive
                ? "bg-slate-900 text-white dark:bg-emerald-500/15 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                isActive ? "text-emerald-400" : "text-slate-400",
              )}
            />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

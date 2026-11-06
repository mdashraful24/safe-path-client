"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Compass,
  FileText,
  GitPullRequest,
  KeyRound,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ShieldAlert,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/brand/logo";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { cn, getErrorMessage } from "@/lib/utils";

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function DashboardSidebar({
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useGetMe();
  const { mutate: logout, isPending: logoutPending } = useLogout();

  const user = data?.data;
  const role = user?.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["USER"] });
        toast.add({
          title: "Logged out",
          description: "You have been signed out.",
          type: "success",
        });
        router.push("/login");
      },
      onError: (error) => {
        toast.add({
          title: "Logout failed",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  const mainLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/incidents", label: "My reports", icon: FileText },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const adminLinks = [
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/incidents", label: "Incidents queue", icon: ShieldAlert },
    {
      href: "/admin/deletion-requests",
      label: "Deletion requests",
      icon: Trash2,
    },
  ];

  const adminOnlyLinks = [
    {
      href: "/admin/change-request",
      label: "Change requests",
      icon: GitPullRequest,
    },
  ];

  const superAdminLinks = [
    {
      href: "/super-admin",
      label: "Super Admin",
      icon: KeyRound,
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const content = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="flex flex-col gap-6">
        {/* Top Header & Logo */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Logo />
          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
              aria-label="Close sidebar"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Quick Report Action */}
        <div className="px-1">
          <Link
            href="/dashboard/incidents/new"
            onClick={onMobileClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/30"
          >
            <PlusCircle className="size-4" />
            <span>Report Incident</span>
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="flex flex-col gap-5 px-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          {/* Main menu */}
          <div className="flex flex-col gap-1">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Menu
            </span>
            {mainLinks.map((link) => {
              const active = isLinkActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-slate-900 text-white dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      active
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-600",
                    )}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Admin menu (if applicable) */}
          {(role === "ADMIN" || role === "SUPER_ADMIN") && (
            <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Administration
              </span>
              {adminLinks.map((link) => {
                const active = isLinkActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-slate-900 text-white dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        active
                          ? "text-emerald-400"
                          : "text-slate-400 group-hover:text-slate-600",
                      )}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              {role === "ADMIN" &&
                adminOnlyLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-slate-900 text-white dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active
                            ? "text-emerald-400"
                            : "text-slate-400 group-hover:text-slate-600",
                        )}
                      />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
            </div>
          )}

          {/* Super admin section */}
          {role === "SUPER_ADMIN" && (
            <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Super Admin
              </span>
              {superAdminLinks.map((link) => {
                const active = isLinkActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-slate-900 text-white dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        active
                          ? "text-emerald-400"
                          : "text-slate-400 group-hover:text-slate-600",
                      )}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Public shortcut */}
          <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Community
            </span>
            <Link
              href="/incidents"
              onClick={onMobileClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Compass className="size-4 shrink-0 text-slate-400" />
              <span>Browse Public Feed</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* User Card & Logout at bottom */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 px-1">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <Link
            href="/dashboard/profile"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 overflow-hidden flex-1 group"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-xs font-bold text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {user?.name ?? "User"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {role ? role.replace("_", " ").toLowerCase() : "account"}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutPending}
            title="Log out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 flex-col shrink-0 border-r border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900/90 sticky top-0 h-screen z-30">
        {content}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl transition-transform animate-in slide-in-from-left">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

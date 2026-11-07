"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Compass,
  LayoutDashboard,
  LogOut,
  Mail,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import UserAvatar from "@/components/ui/user-avatar";
import { useGetSession, useLogout } from "@/hooks";
import { cn, getErrorMessage } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data } = useGetSession();
  const { mutate: logout, isPending } = useLogout();

  const user = data?.data;

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

  const navLinks = [
    { href: "/incidents", label: "Incident Feed", icon: Compass },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  const isLoginActive = pathname === "/login";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/85 transition-all">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Logo />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-md font-medium transition-all duration-200",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold"
                      : "hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200",
                  pathname.startsWith("/dashboard")
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
                )}
              >
                <LayoutDashboard className="size-4 text-emerald-500" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
                <UserAvatar
                  name={user.name}
                  imageUrl={user.imageUrl}
                  className="size-8 rounded-full bg-linear-to-br from-slate-800 to-slate-950 text-white text-md"
                />
                {/* <span className="text-xs font-medium text-slate-600 dark:text-slate-300 max-w-25 truncate">
                  {user.name}
                </span> */}
              </div>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleLogout}
                disabled={isPending}
                className="hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-red-950/30 rounded-full"
                title="Log out"
              >
                <LogOut className="size-4" />
                {/* <span className="hidden md:inline ml-1.5 text-xs">
                  {isPending ? "Exiting..." : "Log out"}
                </span> */}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-md font-medium transition-all duration-200",
                  isLoginActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold"
                    : "hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200",
                )}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/30"
              >
                <ShieldAlert className="size-4" />
                <span>Join SafePath</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMe } from "@/hooks";
import { cn } from "@/lib/utils";

const linkClass =
  "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export default function DashboardNav() {
  const pathname = usePathname();
  const { data } = useGetMe();
  const role = data?.data?.role;

  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    links.push({ href: "/admin/users", label: "Admin" });
  }

  if (role === "SUPER_ADMIN") {
    links.push({ href: "/super-admin", label: "Super Admin" });
  }

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 py-2">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(linkClass, isActive && "bg-muted text-foreground")}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

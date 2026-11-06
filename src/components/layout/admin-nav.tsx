"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/deletion-requests", label: "Deletion requests" },
  { href: "/admin/incidents", label: "Incidents" },
  { href: "/admin/change-request", label: "Change request" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto rounded-lg border bg-muted/40 p-1">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
              isActive && "bg-background text-foreground shadow-sm",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";

export const instant = false;

export const metadata: Metadata = {
  title: "My Reports",
};

export default function UserIncidentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["USER", "ADMIN", "SUPER_ADMIN"]}>{children}</RoleGuard>
  );
}

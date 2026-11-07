import type { Metadata } from "next";
import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";

export const metadata: Metadata = {
  title: "Super Admin",
};

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RoleGuard roles={["SUPER_ADMIN"]}>{children}</RoleGuard>;
}

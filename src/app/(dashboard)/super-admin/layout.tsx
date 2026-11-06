import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RoleGuard roles={["SUPER_ADMIN"]}>{children}</RoleGuard>;
}

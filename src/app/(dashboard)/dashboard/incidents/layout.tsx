import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";

export default function UserIncidentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["USER", "ADMIN", "SUPER_ADMIN"]}>{children}</RoleGuard>
  );
}

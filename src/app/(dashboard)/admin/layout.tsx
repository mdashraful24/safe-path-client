import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import AdminNav from "@/components/layout/admin-nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="flex flex-col gap-6">
        <AdminNav />
        {children}
      </div>
    </RoleGuard>
  );
}

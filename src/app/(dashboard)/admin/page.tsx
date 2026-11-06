"use client";

import RoleGuard from "@/components/auth/role-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
  return (
    <RoleGuard roles={["ADMIN", "SUPER_ADMIN"]}>
      <Card>
        <CardHeader>
          <CardTitle>Admin panel</CardTitle>
          <CardDescription>
            Administrative tools will be added here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You have access to this area as an administrator.
          </p>
        </CardContent>
      </Card>
    </RoleGuard>
  );
}

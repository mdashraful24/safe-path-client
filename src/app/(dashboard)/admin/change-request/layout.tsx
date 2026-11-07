import type { Metadata } from "next";
import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";

export const metadata: Metadata = {
  title: "Change Requests",
};

export default function ChangeRequestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RoleGuard roles={["ADMIN"]}>{children}</RoleGuard>;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Edit Report",
};

export default function EditIncidentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

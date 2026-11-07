import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Incident Review",
};

export default function AdminIncidentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

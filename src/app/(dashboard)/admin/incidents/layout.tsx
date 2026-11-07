import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Incidents Queue",
};

export default function AdminIncidentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

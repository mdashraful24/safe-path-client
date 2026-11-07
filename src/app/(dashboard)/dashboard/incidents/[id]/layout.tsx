import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Report Details",
};

export default function IncidentDetailsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

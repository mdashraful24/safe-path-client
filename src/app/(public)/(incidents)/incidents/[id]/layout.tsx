import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Incident Details",
};

export default function PublicIncidentDetailsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

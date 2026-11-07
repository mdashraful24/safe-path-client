import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Deletion Requests",
};

export default function AdminDeletionRequestsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

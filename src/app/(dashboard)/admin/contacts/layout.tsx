import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Messages",
};

export default function AdminContactsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

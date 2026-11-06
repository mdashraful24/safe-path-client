import type { Metadata } from "next";
import RestoreAccountForm from "@/components/form/restore-account-form";

export const metadata: Metadata = {
  title: "Restore account",
};

export default function RestoreAccountPage() {
  return <RestoreAccountForm />;
}

import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyAccountForm from "@/components/form/verify-account-form";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Verify email",
};

export default function VerifyAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      }
    >
      <VerifyAccountForm />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyAccountForm from "@/components/form/verify-account-form";
import { AuthFormSkeleton } from "@/components/skeletons/auth-skeletons";

export const metadata: Metadata = {
  title: "Verify email",
};

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton showOtp />}>
      <VerifyAccountForm />
    </Suspense>
  );
}

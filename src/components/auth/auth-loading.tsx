import { AppShellSkeleton } from "@/components/skeletons/dashboard-skeletons";

export default function AuthLoading({
  label = "Verifying your account...",
}: {
  label?: string;
}) {
  return <AppShellSkeleton label={label.replace(/\.\.\.$/, "")} />;
}

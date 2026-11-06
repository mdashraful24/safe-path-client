import { Loader } from "lucide-react";

export default function AuthLoading({
  label = "Verifying your account...",
}: {
  label?: string;
}) {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex gap-3">
        <Loader size={24} className="animate-spin" />
        <p>{label}</p>
      </div>
    </div>
  );
}

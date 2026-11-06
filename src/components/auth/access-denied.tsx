import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex gap-3">
        <div className="bg-red-200 rounded-full p-4">
          <ShieldAlert className="text-red-500" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">
            You are not authorized to access this page.
          </h1>
          <p>
            Please go back to the{" "}
            <Link href="/" className="hover:text-blue-500 underline">
              home
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

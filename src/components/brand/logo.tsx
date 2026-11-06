import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 font-semibold tracking-tight",
        className,
      )}
    >
      {/* Location pin inline SVG */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Pin body / teardrop */}
        <path
          d="M16 2C11.0294 2 7 6.02944 7 11C7 17.5 16 30 16 30C16 30 25 17.5 25 11C25 6.02944 20.9706 2 16 2Z"
          fill="#10b981"
        />
        {/* Inner circle highlight */}
        <circle cx="16" cy="11" r="4" fill="white" />
        {/* Dot in center */}
        <circle cx="16" cy="11" r="1.8" fill="#10b981" />
      </svg>

      <span className="text-lg font-bold text-slate-900">
        Safe<span className="text-emerald-500">Path</span>
      </span>
    </Link>
  );
}

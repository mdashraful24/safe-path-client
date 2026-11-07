import { cn } from "cn";
import type * as React from "react";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-xl bg-slate-200/70 dark:bg-slate-800/70",
        className,
      )}
      {...props}
    >
      <span className="skeleton-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-white/10" />
    </div>
  );
}

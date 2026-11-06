import { humanize } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StatusConfig {
  badge: string;
  dot: string;
}

const statusConfigs: Record<string, StatusConfig> = {
  ACTIVE: {
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40",
    dot: "bg-emerald-500",
  },
  RESOLVED: {
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40",
    dot: "bg-emerald-500",
  },
  APPROVED: {
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40",
    dot: "bg-emerald-500",
  },
  BLOCKED: {
    badge:
      "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/40",
    dot: "bg-rose-500",
  },
  REJECTED: {
    badge:
      "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/40",
    dot: "bg-rose-500",
  },
  PENDING: {
    badge:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    badge:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40",
    dot: "bg-amber-500",
  },
  NEW: {
    badge:
      "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800/40",
    dot: "bg-sky-500",
  },
  PENDING_DELETION: {
    badge:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40",
    dot: "bg-amber-500",
  },
  DELETED: {
    badge:
      "bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  PURGED: {
    badge:
      "bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  EMAIL: {
    badge:
      "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800/40",
    dot: "bg-sky-500",
  },
  PASSWORD: {
    badge:
      "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800/40",
    dot: "bg-violet-500",
  },
};

export default function StatusBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const config = statusConfigs[value] ?? {
    badge:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        config.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", config.dot)} />
      <span>{humanize(value)}</span>
    </span>
  );
}

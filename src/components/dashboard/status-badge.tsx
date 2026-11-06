import { humanize } from "@/lib/format";
import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  APPROVED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  BLOCKED: "bg-red-500/10 text-red-700 dark:text-red-400",
  REJECTED: "bg-red-500/10 text-red-700 dark:text-red-400",
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  PENDING_DELETION: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  DELETED: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400",
  PURGED: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400",
  EMAIL: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  PASSWORD: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
};

export default function StatusBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tones[value] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {humanize(value)}
    </span>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

const NAV_KEYS = ["nav-a", "nav-b", "nav-c", "nav-d"] as const;

export function HeaderSkeleton() {
  return (
    <output
      aria-label="Loading navigation"
      className="sticky top-0 z-50 block h-16 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/85"
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="hidden items-center gap-6 md:flex">
          {NAV_KEYS.map((key) => (
            <Skeleton key={key} className="h-3 w-16" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
      <span className="sr-only">Loading navigation...</span>
    </output>
  );
}

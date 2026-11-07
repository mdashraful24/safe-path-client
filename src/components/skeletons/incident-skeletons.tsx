import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_KEYS = [
  "skeleton-a",
  "skeleton-b",
  "skeleton-c",
  "skeleton-d",
  "skeleton-e",
  "skeleton-f",
  "skeleton-g",
  "skeleton-h",
  "skeleton-i",
  "skeleton-j",
] as const;

function IncidentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function IncidentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <output
      aria-label="Loading incidents"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {SKELETON_KEYS.slice(0, count).map((key) => (
        <IncidentCardSkeleton key={key} />
      ))}
      <span className="sr-only">Loading incidents...</span>
    </output>
  );
}

export function CommentsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <output aria-label="Loading comments" className="flex flex-col gap-4">
      {SKELETON_KEYS.slice(0, rows).map((key) => (
        <div key={key} className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
            <Skeleton className="h-7 w-14 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
      <span className="sr-only">Loading comments...</span>
    </output>
  );
}

export function IncidentDetailSkeleton({
  showComments = true,
}: {
  showComments?: boolean;
}) {
  return (
    <output
      aria-label="Loading incident"
      className="mx-auto flex max-w-3xl flex-col gap-6"
    >
      <div>
        <Skeleton className="h-4 w-36" />
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-64 max-w-full" />
            <Skeleton className="h-4 w-48 max-w-full" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-64 w-full rounded-xl" />

      <div className="rounded-xl border border-slate-200/80 p-6 dark:border-slate-800">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 dark:border-slate-800">
          {SKELETON_KEYS.slice(0, 4).map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      {showComments ? (
        <div className="rounded-xl border border-slate-200/80 p-6 dark:border-slate-800">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-2 h-3 w-56" />
          <div className="mt-5">
            <CommentsSkeleton />
          </div>
        </div>
      ) : null}

      <Skeleton className="h-9 w-48 rounded-full" />
      <span className="sr-only">Loading incident...</span>
    </output>
  );
}

export function IncidentFormSkeleton() {
  return (
    <output
      aria-label="Loading report form"
      className="mx-auto flex max-w-3xl flex-col gap-6"
    >
      <div>
        <Skeleton className="h-4 w-36" />
        <div className="mt-3 flex flex-col gap-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-xl border border-slate-200/80 p-6 dark:border-slate-800">
        <div className="grid gap-5 sm:grid-cols-2">
          {SKELETON_KEYS.slice(0, 4).map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>
      <span className="sr-only">Loading report form...</span>
    </output>
  );
}

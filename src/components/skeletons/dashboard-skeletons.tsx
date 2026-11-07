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

export function DashboardOverviewSkeleton() {
  return (
    <output aria-label="Loading dashboard" className="flex flex-col gap-8">
      <Skeleton className="h-44 w-full rounded-3xl" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SKELETON_KEYS.slice(0, 4).map((key) => (
          <div
            key={key}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 p-5 dark:border-slate-800"
          >
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-2.5 w-28" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {SKELETON_KEYS.slice(0, 2).map((key) => (
          <div
            key={key}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 p-6 dark:border-slate-800"
          >
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex flex-col gap-3">
              {SKELETON_KEYS.slice(0, 4).map((rowKey) => (
                <div key={rowKey} className="flex items-center gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-lg" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading dashboard...</span>
    </output>
  );
}

export function ProfileSkeleton() {
  return (
    <output
      aria-label="Loading profile"
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-12"
    >
      <Skeleton className="h-44 w-full rounded-[28px]" />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800">
            <Skeleton className="h-24 w-full rounded-none" />
            <div className="px-6 pb-6">
              <Skeleton className="-mt-10 size-22 rounded-2xl ring-4 ring-white dark:ring-slate-900" />
              <Skeleton className="mt-4 h-5 w-40" />
              <Skeleton className="mt-2 h-3 w-52 max-w-full" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                {SKELETON_KEYS.slice(0, 3).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>

        <div className="flex flex-col gap-6">
          {SKELETON_KEYS.slice(0, 3).map((key) => (
            <div
              key={key}
              className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 p-6 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-56 max-w-full" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {SKELETON_KEYS.slice(0, 2).map((fieldKey) => (
                  <div key={fieldKey} className="flex flex-col gap-2">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading profile...</span>
    </output>
  );
}

export function AppShellSkeleton({
  label = "Loading application",
}: {
  label?: string;
}) {
  return (
    <output
      aria-label={label}
      className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950"
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>

      <div className="flex flex-1 gap-6 p-4 sm:p-6">
        <aside className="hidden w-64 shrink-0 flex-col gap-3 lg:flex">
          <Skeleton className="h-10 w-full" />
          {SKELETON_KEYS.slice(0, 6).map((key) => (
            <Skeleton key={key} className="h-10 w-full" />
          ))}
        </aside>
        <main className="flex min-w-0 flex-1 flex-col gap-6">
          <Skeleton className="h-44 w-full rounded-3xl" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {SKELETON_KEYS.slice(0, 4).map((key) => (
              <Skeleton key={key} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <div className="grid flex-1 gap-4 lg:grid-cols-2">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </main>
      </div>
      <span className="sr-only">{label}...</span>
    </output>
  );
}

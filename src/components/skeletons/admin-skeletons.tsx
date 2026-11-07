import { Skeleton } from "@/components/ui/skeleton";

const TABLE_KEYS = [
  "row-a",
  "row-b",
  "row-c",
  "row-d",
  "row-e",
  "row-f",
  "row-g",
  "row-h",
  "row-i",
  "row-j",
] as const;

const CELL_KEYS = [
  "cell-a",
  "cell-b",
  "cell-c",
  "cell-d",
  "cell-e",
  "cell-f",
  "cell-g",
  "cell-h",
  "cell-i",
  "cell-j",
] as const;

const FIELD_KEYS = ["field-a", "field-b", "field-c", "field-d"] as const;

function gridTemplate(columns: number) {
  return { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` };
}

export function TableSkeleton({
  columns = 6,
  rows = 8,
  label = "Loading table",
}: {
  columns?: number;
  rows?: number;
  label?: string;
}) {
  return (
    <output
      aria-label={label}
      className="block overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800"
    >
      <div
        className="grid items-center gap-4 border-b border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60"
        style={gridTemplate(columns)}
      >
        {CELL_KEYS.slice(0, columns).map((key, index) => (
          <Skeleton
            key={key}
            className={index === columns - 1 ? "ml-auto h-3 w-12" : "h-3 w-20"}
          />
        ))}
      </div>
      {TABLE_KEYS.slice(0, rows).map((rowKey) => (
        <div
          key={rowKey}
          className="grid items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0 dark:border-slate-800/80"
          style={gridTemplate(columns)}
        >
          {CELL_KEYS.slice(0, columns).map((cellKey, index) => (
            <Skeleton
              key={cellKey}
              className={
                index === 0
                  ? "h-4 w-4/5"
                  : index === columns - 1
                    ? "ml-auto h-7 w-16 rounded-full"
                    : "h-3 w-3/5"
              }
            />
          ))}
        </div>
      ))}
      <span className="sr-only">{label}...</span>
    </output>
  );
}

export function AdminIncidentDetailSkeleton() {
  return (
    <output aria-label="Loading incident" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-1 h-7 w-64 max-w-full" />
          <Skeleton className="h-4 w-56 max-w-full" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 p-6 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="grid gap-4 sm:grid-cols-2">
              {FIELD_KEYS.map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 p-6 dark:border-slate-800">
            <Skeleton className="h-5 w-24" />
            {FIELD_KEYS.slice(0, 3).map((key) => (
              <div key={key} className="flex flex-col gap-2">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
      <span className="sr-only">Loading incident...</span>
    </output>
  );
}

export function UserDetailsSkeleton() {
  return (
    <output
      aria-label="Loading user details"
      className="block max-h-[55vh] overflow-y-auto px-6 py-6"
    >
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-28" />
        <div className="grid gap-3 sm:grid-cols-2">
          {TABLE_KEYS.slice(0, 6).map((key) => (
            <div
              key={key}
              className="flex flex-col gap-2 rounded-lg border border-slate-200/80 p-3 dark:border-slate-800"
            >
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-32" />
        <div className="grid gap-3 sm:grid-cols-2">
          {TABLE_KEYS.slice(0, 4).map((key) => (
            <div
              key={key}
              className="flex flex-col gap-2 rounded-lg border border-slate-200/80 p-3 dark:border-slate-800"
            >
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading user details...</span>
    </output>
  );
}

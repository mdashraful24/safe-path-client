import { Skeleton } from "@/components/ui/skeleton";

export function AuthFormSkeleton({ showOtp = false }: { showOtp?: boolean }) {
  return (
    <output aria-label="Loading form" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      {showOtp ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-3 w-40" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-11 w-full" />
        </div>
      )}

      <Skeleton className="h-11 w-full rounded-full" />
      <Skeleton className="mx-auto h-3 w-48" />
      <span className="sr-only">Loading form...</span>
    </output>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import IncidentForm from "@/components/modules/incidents/incident-form";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMyIncident } from "@/hooks";

export default function EditIncidentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      }
    >
      <EditIncidentContent />
    </Suspense>
  );
}

function EditIncidentContent() {
  const params = useParams();
  const incidentId = typeof params.id === "string" ? params.id : null;
  const { data, isPending, isError } = useMyIncident(incidentId);

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3">
        <h1 className="text-xl font-bold">Report not found</h1>
        <p className="text-sm text-muted-foreground">
          This report does not exist or does not belong to you.
        </p>
        <Link
          href="/dashboard/incidents"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Back to my reports
        </Link>
      </div>
    );
  }

  const incident = data.data;
  const canEdit = incident.status === "PENDING";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href={`/dashboard/incidents/${incident.id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to report
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit report</h1>
            <p className="text-sm text-muted-foreground">
              Update your report while it is still awaiting review.
            </p>
          </div>
          <StatusBadge value={incident.status} />
        </div>
      </div>

      {canEdit ? (
        <IncidentForm incident={incident} />
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-2xl border bg-muted/40 p-5">
          <p className="text-sm text-muted-foreground">
            This report has already been reviewed and can no longer be edited.
          </p>
          <Link
            href={`/dashboard/incidents/${incident.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Back to report
          </Link>
        </div>
      )}
    </div>
  );
}

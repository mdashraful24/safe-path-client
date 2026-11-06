"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import IncidentForm from "@/components/modules/incidents/incident-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useDeleteMyIncident, useMyIncident } from "@/hooks";
import { formatDate, formatDateTime, humanize } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";

export default function MyIncidentDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      }
    >
      <MyIncidentDetailContent />
    </Suspense>
  );
}

function MyIncidentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const incidentId = typeof params.id === "string" ? params.id : null;
  const { data, isPending, isError } = useMyIncident(incidentId);
  const deleteIncident = useDeleteMyIncident();
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-start gap-3">
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

  const handleDelete = () => {
    deleteIncident.mutate(incident.id, {
      onSuccess: () => {
        toast.add({
          title: "Report deleted",
          description: "Your incident report was removed.",
          type: "success",
        });
        router.push("/dashboard/incidents");
      },
      onError: (error) => {
        toast.add({
          title: "Delete failed",
          description: getErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href="/dashboard/incidents"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to my reports
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {incident.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {humanize(incident.category)} ·{" "}
              {formatDate(incident.incidentDate)}
            </p>
          </div>
          <StatusBadge value={incident.status} />
        </div>
      </div>

      {incident.imageUrl && (
        <Image
          src={incident.imageUrl}
          alt={incident.title}
          width={960}
          height={540}
          className="max-h-96 w-full rounded-xl object-cover"
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Report details</CardTitle>
          <CardDescription>
            Submitted {formatDateTime(incident.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="whitespace-pre-wrap text-sm">{incident.description}</p>
          <div className="grid gap-3 border-t pt-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Area</p>
              <p>{incident.area}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p>{incident.location || "Not specified"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Review status</p>
              <StatusBadge value={incident.status} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p>{formatDateTime(incident.updatedAt)}</p>
            </div>
          </div>

          {incident.reviewNote && (
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Reviewer note
              </p>
              <p className="mt-1 text-sm">{incident.reviewNote}</p>
            </div>
          )}

          {incident.status === "APPROVED" && (
            <div>
              <Link
                href={`/incidents/${incident.id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                View public report
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {canEdit ? (
        <>
          <div>
            <h2 className="text-lg font-semibold">Edit report</h2>
            <p className="text-sm text-muted-foreground">
              You can edit this report until an administrator reviews it.
            </p>
          </div>
          <IncidentForm incident={incident} />

          <Card>
            <CardHeader>
              <CardTitle>Delete report</CardTitle>
              <CardDescription>
                Remove this pending report and its image permanently.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                Delete report
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
          This report has already been reviewed and can no longer be edited or
          deleted.
        </p>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this report?</DialogTitle>
            <DialogDescription>
              This cannot be undone. The incident and its image will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteIncident.isPending}
              onClick={handleDelete}
            >
              {deleteIncident.isPending ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                "Delete permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

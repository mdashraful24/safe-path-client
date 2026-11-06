"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import IncidentComments from "@/components/modules/comments/incident-comments";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { usePublicIncident } from "@/hooks";
import { formatDate, formatDateTime, humanize } from "@/lib/format";

export default function IncidentDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      }
    >
      <IncidentDetailContent />
    </Suspense>
  );
}

function IncidentDetailContent() {
  const params = useParams();
  const incidentId = typeof params.id === "string" ? params.id : null;
  const { data, isPending, isError } = usePublicIncident(incidentId);

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
        <h1 className="text-xl font-bold">Incident not found</h1>
        <p className="text-sm text-muted-foreground">
          This report may have been removed or is not published.
        </p>
        <Link
          href="/incidents"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Back to incidents
        </Link>
      </div>
    );
  }

  const incident = data.data;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href="/incidents"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to incidents
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {incident.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {humanize(incident.category)} · Reported{" "}
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
            Published {formatDateTime(incident.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="whitespace-pre-wrap text-sm">{incident.description}</p>
          <div className="grid gap-3 border-t pt-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Area</p>
              <p className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden="true" />
                {incident.area}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p>{incident.location || "Not specified"}</p>
            </div>
            {incident.latitude != null && incident.longitude != null && (
              <div>
                <p className="text-xs text-muted-foreground">Coordinates</p>
                <p>
                  {incident.latitude}, {incident.longitude}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p>{formatDateTime(incident.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <IncidentComments incidentId={incident.id} />

      <div>
        <Link
          href="/dashboard/incidents/new"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Report a similar incident
        </Link>
      </div>
    </div>
  );
}

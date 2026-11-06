"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useDashboardOverview, useGetMe } from "@/hooks";
import { formatDate, formatDateTime } from "@/lib/format";
import type {
  AdminChangeRequestSummary,
  DashboardIncidentCard,
  DeletionRequestItem,
} from "@/types";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function RecentIncidents({
  incidents,
}: {
  incidents: DashboardIncidentCard[];
}) {
  if (incidents.length === 0) {
    return <p className="text-sm text-muted-foreground">No incidents yet.</p>;
  }

  return (
    <div className="flex flex-col divide-y">
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
        >
          <div>
            <p className="font-medium">{incident.title}</p>
            <p className="text-xs text-muted-foreground">
              {incident.area} · {formatDate(incident.incidentDate)}
              {incident.reporter ? ` · ${incident.reporter.name}` : ""}
            </p>
          </div>
          <StatusBadge value={incident.status} />
        </div>
      ))}
    </div>
  );
}

function RecentDeletionRequests({
  requests,
}: {
  requests: DeletionRequestItem[];
}) {
  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No pending requests.</p>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {requests.map((request) => (
        <div key={request.id} className="py-2 first:pt-0 last:pb-0">
          <p className="font-medium">{request.name}</p>
          <p className="text-xs text-muted-foreground">
            {request.email} · requested{" "}
            {formatDateTime(request.deletionRequestedAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

function RecentChangeRequests({
  requests,
}: {
  requests: AdminChangeRequestSummary[];
}) {
  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No pending requests.</p>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
        >
          <div>
            <p className="font-medium">{request.requester.name}</p>
            <p className="text-xs text-muted-foreground">{request.reason}</p>
          </div>
          <StatusBadge value={request.type} />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: me } = useGetMe();
  const { data, isPending, isError } = useDashboardOverview();

  const user = me?.data;
  const overview = data?.data;

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <p className="text-sm text-muted-foreground">
        Could not load the dashboard overview.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview for your {overview.role.toLowerCase().replace("_", " ")}{" "}
            account.
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Manage profile
        </Link>
      </div>

      {overview.role === "USER" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total reports" value={overview.incidents.total} />
            <Stat label="Pending" value={overview.incidents.pending} />
            <Stat label="Approved" value={overview.incidents.approved} />
            <Stat label="Rejected" value={overview.incidents.rejected} />
          </div>
          <Section
            title="Recently approved reports"
            description="Your latest approved safety reports."
          >
            <RecentIncidents incidents={overview.recentIncidents} />
          </Section>
        </>
      )}

      {overview.role === "ADMIN" && (
        <>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Stat label="Users" value={overview.users.total} />
            <Stat label="Active" value={overview.users.active} />
            <Stat label="Blocked" value={overview.users.blocked} />
            <Stat
              label="Pending deletion"
              value={overview.users.pendingDeletion}
            />
            <Stat label="Deleted" value={overview.users.deleted} />
            <Stat label="Incidents" value={overview.incidents.total} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Section
              title="Pending incidents"
              description="Incidents waiting for review."
              action={
                <Link
                  href="/admin/incidents"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Review
                </Link>
              }
            >
              <RecentIncidents incidents={overview.recentPendingIncidents} />
            </Section>
            <Section
              title="Deletion requests"
              description="Accounts awaiting a decision."
              action={
                <Link
                  href="/admin/deletion-requests"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Review
                </Link>
              }
            >
              <RecentDeletionRequests
                requests={overview.recentDeletionRequests}
              />
            </Section>
          </div>
        </>
      )}

      {overview.role === "SUPER_ADMIN" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Users" value={overview.users.byRole.users} />
            <Stat label="Admins" value={overview.users.byRole.admins} />
            <Stat
              label="Super admins"
              value={overview.users.byRole.superAdmins}
            />
            <Stat label="Incidents" value={overview.incidents.total} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Section
              title="Pending incidents"
              description="Incidents waiting for review."
              action={
                <Link
                  href="/admin/incidents"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Review
                </Link>
              }
            >
              <RecentIncidents incidents={overview.recentPendingIncidents} />
            </Section>
            <Section
              title="Deletion requests"
              description="Accounts awaiting a decision."
              action={
                <Link
                  href="/admin/deletion-requests"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Review
                </Link>
              }
            >
              <RecentDeletionRequests
                requests={overview.recentDeletionRequests}
              />
            </Section>
            <Section
              title="Admin change requests"
              description="Email and password change requests."
              action={
                <Link
                  href="/super-admin"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Review
                </Link>
              }
            >
              <RecentChangeRequests requests={overview.recentChangeRequests} />
            </Section>
          </div>
        </>
      )}
    </div>
  );
}

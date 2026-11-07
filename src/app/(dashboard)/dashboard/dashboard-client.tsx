"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  GitPullRequest,
  PlusCircle,
  Shield,
  ShieldAlert,
  Trash2,
  UserCheck,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import { DashboardOverviewSkeleton } from "@/components/skeletons/dashboard-skeletons";
import { useDashboardOverview, useGetMe } from "@/hooks";
import { formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  AdminChangeRequestSummary,
  DashboardIncidentCard,
  DeletionRequestItem,
} from "@/types";

interface StatProps {
  label: string;
  value: number;
  icon: typeof Shield;
  color?: "emerald" | "amber" | "rose" | "sky" | "indigo" | "slate";
}

const colorMap = {
  emerald: {
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    glow: "group-hover:border-emerald-500/40",
  },
  amber: {
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    glow: "group-hover:border-amber-500/40",
  },
  rose: {
    bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    glow: "group-hover:border-rose-500/40",
  },
  sky: {
    bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20",
    glow: "group-hover:border-sky-500/40",
  },
  indigo: {
    bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20",
    glow: "group-hover:border-indigo-500/40",
  },
  slate: {
    bg: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 ring-slate-200",
    glow: "group-hover:border-slate-400",
  },
};

function StatCard({ label, value, icon: Icon, color = "emerald" }: StatProps) {
  const styles = colorMap[color];

  return (
    <div
      className={cn(
        "group relative flex items-center justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        styles.glow,
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
      </div>

      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-2xl ring-1 shrink-0 transition-transform duration-300 group-hover:scale-110",
          styles.bg,
        )}
      >
        <Icon className="size-6" />
      </div>
    </div>
  );
}

function SectionCard({
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
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs overflow-hidden">
      <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

function RecentIncidents({
  incidents,
  hrefPrefix,
}: {
  incidents: DashboardIncidentCard[];
  hrefPrefix?: string;
}) {
  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
        <Shield className="size-8 opacity-40 mb-2" />
        <p className="text-sm">No incidents reported yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/80">
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {hrefPrefix ? (
                <Link
                  href={`${hrefPrefix}/${incident.id}`}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {incident.title}
                </Link>
              ) : (
                incident.title
              )}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                {incident.area}
              </span>{" "}
              · {formatDate(incident.incidentDate)}
              {incident.reporter ? ` · by ${incident.reporter.name}` : ""}
            </p>
          </div>
          <div className="self-start sm:self-center shrink-0">
            <StatusBadge value={incident.status} />
          </div>
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
      <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
        <UserCheck className="size-8 opacity-40 mb-2" />
        <p className="text-sm">No pending deletion requests.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/80">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
        >
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {request.name}
            </p>
            <p className="text-xs text-slate-400">
              {request.email} · requested{" "}
              {formatDateTime(request.deletionRequestedAt)}
            </p>
          </div>
          <span className="rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 px-2.5 py-0.5 text-[11px] font-semibold">
            Pending
          </span>
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
      <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
        <GitPullRequest className="size-8 opacity-40 mb-2" />
        <p className="text-sm">No pending change requests.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/80">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {request.requester.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {request.reason}
            </p>
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
    return <DashboardOverviewSkeleton />;
  }

  if (isError || !overview) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
        Could not load the dashboard overview. Please check your network and
        refresh.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-md">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 size-60 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 size-60 rounded-full bg-slate-800 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 text-xs font-semibold text-emerald-400">
                {overview.role.replace("_", " ")} Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back{user ? `, ${user.name}` : ""}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Here is what is happening across SafePath. Stay informed, review
              reports, and ensure community safety.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/incidents/new"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all hover:shadow-md hover:shadow-emerald-500/30"
            >
              <PlusCircle className="size-4" />
              <span>Report incident</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-all backdrop-blur-sm"
            >
              <span>Manage profile</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* USER ROLE DASHBOARD */}
      {overview.role === "USER" && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total reports"
              value={overview.incidents.total}
              icon={FileText}
              color="slate"
            />
            <StatCard
              label="Pending review"
              value={overview.incidents.pending}
              icon={Clock}
              color="amber"
            />
            <StatCard
              label="Approved"
              value={overview.incidents.approved}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              label="Rejected"
              value={overview.incidents.rejected}
              icon={XCircle}
              color="rose"
            />
          </div>

          <SectionCard
            title="Recently Approved Reports"
            description="Your latest reports verified and live on the public feed."
            action={
              <Link
                href="/dashboard/incidents"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <span>View all my reports</span>
                <ArrowRight className="size-3" />
              </Link>
            }
          >
            <RecentIncidents
              incidents={overview.recentIncidents}
              hrefPrefix="/incidents"
            />
          </SectionCard>
        </div>
      )}

      {/* ADMIN ROLE DASHBOARD */}
      {overview.role === "ADMIN" && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard
              label="Total Users"
              value={overview.users.total}
              icon={Users}
              color="indigo"
            />
            <StatCard
              label="Active Users"
              value={overview.users.active}
              icon={UserCheck}
              color="emerald"
            />
            <StatCard
              label="Blocked"
              value={overview.users.blocked}
              icon={UserX}
              color="rose"
            />
            <StatCard
              label="Pending Deletion"
              value={overview.users.pendingDeletion}
              icon={Trash2}
              color="amber"
            />
            <StatCard
              label="Deleted Users"
              value={overview.users.deleted}
              icon={UserX}
              color="slate"
            />
            <StatCard
              label="Incidents Queue"
              value={overview.incidents.total}
              icon={ShieldAlert}
              color="sky"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Pending Incidents Review"
              description="Reports requiring administrative verification before publishing."
              action={
                <Link
                  href="/admin/incidents"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white dark:bg-emerald-500/15 dark:text-emerald-400 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <span>Review queue</span>
                  <ArrowRight className="size-3" />
                </Link>
              }
            >
              <RecentIncidents
                incidents={overview.recentPendingIncidents}
                hrefPrefix="/admin/incidents"
              />
            </SectionCard>

            <SectionCard
              title="Account Deletion Requests"
              description="User accounts awaiting deletion decision."
              action={
                <Link
                  href="/admin/deletion-requests"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Review requests</span>
                  <ArrowRight className="size-3" />
                </Link>
              }
            >
              <RecentDeletionRequests
                requests={overview.recentDeletionRequests}
              />
            </SectionCard>
          </div>
        </div>
      )}

      {/* SUPER ADMIN ROLE DASHBOARD */}
      {overview.role === "SUPER_ADMIN" && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Standard Users"
              value={overview.users.byRole.users}
              icon={Users}
              color="slate"
            />
            <StatCard
              label="Admin Accounts"
              value={overview.users.byRole.admins}
              icon={Shield}
              color="sky"
            />
            <StatCard
              label="Super Admins"
              value={overview.users.byRole.superAdmins}
              icon={AlertTriangle}
              color="indigo"
            />
            <StatCard
              label="Total Incidents"
              value={overview.incidents.total}
              icon={ShieldAlert}
              color="emerald"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Pending Incidents"
              description="Incident submissions requiring review."
              action={
                <Link
                  href="/admin/incidents"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Review</span>
                  <ArrowRight className="size-3" />
                </Link>
              }
            >
              <RecentIncidents
                incidents={overview.recentPendingIncidents}
                hrefPrefix="/admin/incidents"
              />
            </SectionCard>

            <SectionCard
              title="Deletion Requests"
              description="Pending decisions on user account deletions."
              action={
                <Link
                  href="/admin/deletion-requests"
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Review</span>
                  <ArrowRight className="size-3" />
                </Link>
              }
            >
              <RecentDeletionRequests
                requests={overview.recentDeletionRequests}
              />
            </SectionCard>

            <div className="lg:col-span-2">
              <SectionCard
                title="Admin Change Requests"
                description="Administrative credential change requests requiring super admin sign-off."
                action={
                  <Link
                    href="/super-admin"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white dark:bg-emerald-500/15 dark:text-emerald-400 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <span>Manage all</span>
                    <ArrowRight className="size-3" />
                  </Link>
                }
              >
                <RecentChangeRequests
                  requests={overview.recentChangeRequests}
                />
              </SectionCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

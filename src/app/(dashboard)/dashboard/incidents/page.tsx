"use client";

import {
  FileText,
  Filter,
  PlusCircle,
  Search,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import IncidentCard from "@/components/modules/incidents/incident-card";
import NativeSelect from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import TablePagination from "@/components/ui/table-pagination";
import { useMyIncidents } from "@/hooks";
import type { IncidentStatus } from "@/types";

const PAGE_SIZE = 9;

const statusOptions: Array<{ value: "" | IncidentStatus; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function MyIncidentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | IncidentStatus>("");

  const { data, isPending } = useMyIncidents({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: status || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const incidents = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Incident Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your submitted safety reports and administrative review
            status.
          </p>
        </div>

        <Link
          href="/dashboard/incidents/new"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all hover:shadow-md hover:shadow-emerald-500/30 self-start sm:self-auto"
        >
          <PlusCircle className="size-4" />
          <span>New report</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            autoComplete="off"
            placeholder="Search within your reports..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border-0 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        <div className="sm:w-56">
          <NativeSelect
            aria-label="Filter by status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "" | IncidentStatus);
              setPage(1);
            }}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border-0 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          >
            {statusOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      {/* Reports Grid */}
      {isPending ? (
        <div className="flex h-72 items-center justify-center">
          <Spinner />
        </div>
      ) : incidents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-16 text-center bg-white dark:bg-slate-900/40">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 mb-4">
            <FileText className="size-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            You haven&apos;t reported any incidents yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Help your neighborhood stay secure by submitting a safety concern.
          </p>
          <Link
            href="/dashboard/incidents/new"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all mt-6"
          >
            <PlusCircle className="size-4" />
            <span>Create your first report</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              href={`/dashboard/incidents/${incident.id}`}
              showStatus
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800 pt-6 text-xs font-medium">
        <span>
          {meta
            ? `Showing page ${meta.page} of ${meta.totalPages} (${meta.total} reports)`
            : ""}
        </span>
        {meta && (
          <TablePagination
            page={page}
            totalPages={meta.totalPages}
            handlePageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}

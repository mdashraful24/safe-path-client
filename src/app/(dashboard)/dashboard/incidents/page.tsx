"use client";

import Link from "next/link";
import { useState } from "react";
import IncidentCard from "@/components/modules/incidents/incident-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My reports</h1>
          <p className="text-sm text-muted-foreground">
            Track your incident reports and their review status.
          </p>
        </div>
        <Link
          href="/dashboard/incidents/new"
          className={buttonVariants({ size: "sm" })}
        >
          Report an incident
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search your reports"
          value={search}
          className="w-full sm:w-64"
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <NativeSelect
          aria-label="Filter by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "" | IncidentStatus);
            setPage(1);
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {isPending ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : incidents.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">You have not reported an incident yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Help your community by sharing a safety concern.
          </p>
          <Link
            href="/dashboard/incidents/new"
            className={buttonVariants({ size: "sm", className: "mt-4" })}
          >
            Create your first report
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{meta ? `${meta.total} reports` : ""}</span>
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

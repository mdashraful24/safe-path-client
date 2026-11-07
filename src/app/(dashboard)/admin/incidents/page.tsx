"use client";

import Link from "next/link";
import { useState } from "react";
import StatusBadge from "@/components/dashboard/status-badge";
import { TableSkeleton } from "@/components/skeletons/admin-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NativeSelect from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { useAdminIncidents } from "@/hooks";
import { formatDate, humanize } from "@/lib/format";
import type { IncidentCategory, IncidentStatus } from "@/types";

const PAGE_SIZE = 10;

const statusOptions: Array<{ value: "" | IncidentStatus; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const categoryOptions: Array<{ value: "" | IncidentCategory; label: string }> =
  [
    { value: "", label: "All categories" },
    { value: "HARASSMENT", label: "Harassment" },
    { value: "THEFT", label: "Theft" },
    { value: "SUSPICIOUS_ACTIVITY", label: "Suspicious activity" },
    { value: "UNSAFE_AREA", label: "Unsafe area" },
    { value: "OTHER", label: "Other" },
  ];

export default function AdminIncidentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | IncidentStatus>("");
  const [category, setCategory] = useState<"" | IncidentCategory>("");

  const { data, isPending } = useAdminIncidents({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: status || undefined,
    category: category || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const incidents = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Incidents</h1>
        <p className="text-sm text-muted-foreground">
          Review reports, update details, and moderate published incidents.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search title, description, or area"
          value={search}
          className="w-full sm:w-72"
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
        <NativeSelect
          aria-label="Filter by category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value as "" | IncidentCategory);
            setPage(1);
          }}
        >
          {categoryOptions.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {isPending ? (
        <TableSkeleton columns={7} rows={PAGE_SIZE} label="Loading incidents" />
      ) : (
        <>
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No incidents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="max-w-56 truncate font-medium">
                        {incident.title}
                      </TableCell>
                      <TableCell>{humanize(incident.category)}</TableCell>
                      <TableCell>{incident.area}</TableCell>
                      <TableCell>{formatDate(incident.incidentDate)}</TableCell>
                      <TableCell>{incident.reporter.name}</TableCell>
                      <TableCell>
                        <StatusBadge value={incident.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Link
                            href={`/admin/incidents/${incident.id}`}
                            className={buttonVariants({
                              variant: "outline",
                              size: "sm",
                            })}
                          >
                            Open
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>{meta ? `${meta.total} total incidents` : ""}</span>
            {meta && (
              <TablePagination
                page={page}
                totalPages={meta.totalPages}
                handlePageChange={setPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

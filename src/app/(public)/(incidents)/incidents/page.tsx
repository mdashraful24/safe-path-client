"use client";

import Link from "next/link";
import { useState } from "react";
import IncidentCard from "@/components/modules/incidents/incident-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NativeSelect from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import TablePagination from "@/components/ui/table-pagination";
import { usePublicIncidents } from "@/hooks";
import type { IncidentCategory } from "@/types";

const PAGE_SIZE = 9;

const categoryOptions: Array<{ value: "" | IncidentCategory; label: string }> =
  [
    { value: "", label: "All categories" },
    { value: "HARASSMENT", label: "Harassment" },
    { value: "THEFT", label: "Theft" },
    { value: "SUSPICIOUS_ACTIVITY", label: "Suspicious activity" },
    { value: "UNSAFE_AREA", label: "Unsafe area" },
    { value: "OTHER", label: "Other" },
  ];

export default function IncidentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState<"" | IncidentCategory>("");

  const { data, isPending } = usePublicIncidents({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    area: area || undefined,
    category: category || undefined,
    sortBy: "incidentDate",
    sortOrder: "desc",
  });

  const incidents = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Community incidents
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse verified safety reports from the community.
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
          placeholder="Search incidents"
          value={search}
          className="w-full sm:w-64"
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <Input
          placeholder="Filter by area"
          value={area}
          className="w-full sm:w-48"
          onChange={(event) => {
            setArea(event.target.value);
            setPage(1);
          }}
        />
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
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : incidents.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">No incidents found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              href={`/incidents/${incident.id}`}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{meta ? `${meta.total} verified incidents` : ""}</span>
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

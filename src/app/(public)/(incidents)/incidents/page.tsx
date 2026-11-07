"use client";

import {
  Compass,
  Filter,
  MapPin,
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
    <div className="flex flex-col gap-8 pb-4">
      {/* Page Title & Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Compass className="size-3.5" />
              <span>Public Safety Directory</span>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Community Incidents
          </h1>
          <p className="mt-1 text-md dark:text-slate-400 max-w-xl">
            Browse verified safety reports, track trends in your neighborhood,
            and stay aware of ongoing concerns.
          </p>
        </div>

        <Link
          href="/dashboard/incidents/new"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all hover:shadow-md hover:shadow-emerald-500/30 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="size-4" />
          <span>Report incident</span>
        </Link>
      </div>

      {/* Filter Toolbar Card */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            autoComplete="off"
            placeholder="Search keywords, details..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border-0 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        {/* Area Filter */}
        <div className="relative sm:w-60">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            autoComplete="off"
            placeholder="Filter area / street..."
            value={area}
            onChange={(event) => {
              setArea(event.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border-0 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        {/* Category Select */}
        <div className="sm:w-52">
          <NativeSelect
            aria-label="Filter by category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value as "" | IncidentCategory);
              setPage(1);
            }}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 border-0 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          >
            {categoryOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      {/* Incidents Grid */}
      {isPending ? (
        <div className="flex h-72 items-center justify-center">
          <Spinner />
        </div>
      ) : incidents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-16 text-center bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
            <ShieldAlert className="size-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No incidents found
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            We couldn't find any verified incident matching your search filters.
            Try adjusting your search query or area.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              href={`/incidents/${incident.id}`}
            />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800 pt-6 text-xs font-medium">
        <span>
          {meta
            ? `Showing page ${meta.page} of ${meta.totalPages} (${meta.total} verified reports)`
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

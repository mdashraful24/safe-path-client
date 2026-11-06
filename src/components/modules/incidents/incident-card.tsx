import { Calendar, MapPin, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/status-badge";
import { formatDate, humanize } from "@/lib/format";
import type { Incident } from "@/types";

export default function IncidentCard({
  incident,
  href,
  showStatus = false,
}: {
  incident: Incident;
  href: string;
  showStatus?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
    >
      {/* Card Header / Image Media */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        {incident.imageUrl ? (
          <Image
            src={incident.imageUrl}
            alt={incident.title}
            width={640}
            height={320}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-slate-400">
            {/* Subtle dot pattern */}
            <div
              className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/40 text-emerald-400">
                <ShieldAlert className="size-6" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                SafePath Verified
              </span>
            </div>
          </div>
        )}

        {/* Floating Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          <span className="rounded-full bg-slate-900/75 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wide text-white ring-1 ring-white/15">
            {humanize(incident.category)}
          </span>
          {showStatus && <StatusBadge value={incident.status} />}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {incident.title}
          </h2>
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {incident.description}
          </p>
        </div>

        {/* Card Footer Metadata */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 text-emerald-500 shrink-0" />
            <span className="font-medium truncate">{incident.area}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <Calendar className="size-3.5" />
            <span>{formatDate(incident.incidentDate)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

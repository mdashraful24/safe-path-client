import { MapPin } from "lucide-react";
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
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
      {incident.imageUrl ? (
        <Image
          src={incident.imageUrl}
          alt={incident.title}
          width={640}
          height={320}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-muted text-muted-foreground">
          <MapPin className="size-8" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {humanize(incident.category)}
          </span>
          {showStatus && <StatusBadge value={incident.status} />}
        </div>
        <h2 className="font-semibold group-hover:underline">
          {incident.title}
        </h2>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {incident.description}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {incident.area}
          </span>
          <span>{formatDate(incident.incidentDate)}</span>
        </div>
      </div>
    </Link>
  );
}

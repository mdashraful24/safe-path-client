import type { Metadata } from "next";
import Link from "next/link";
import IncidentForm from "@/components/modules/incidents/incident-form";

export const metadata: Metadata = {
  title: "New Report",
};

export default function NewIncidentPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href="/dashboard/incidents"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to my reports
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Report an incident
        </h1>
        <p className="text-sm text-muted-foreground">
          Your report will be reviewed by an administrator before it is
          published.
        </p>
      </div>

      <IncidentForm />
    </div>
  );
}

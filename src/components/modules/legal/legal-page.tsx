import type { LucideIcon } from "lucide-react";
import { CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import LegalToc from "./legal-toc";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface LegalPageProps {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  icon: LucideIcon;
  accent?: "emerald" | "sky" | "amber" | "rose";
  sections: LegalSection[];
}

const accentStyles = {
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
    glow: "bg-emerald-500/20",
    marker:
      "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
  },
  sky: {
    badge: "bg-sky-500/10 text-sky-300 ring-sky-500/30",
    glow: "bg-sky-500/20",
    marker: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
    glow: "bg-amber-500/20",
    marker:
      "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
  },
  rose: {
    badge: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
    glow: "bg-rose-500/20",
    marker: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-400",
  },
} as const;

export default function LegalPage({
  eyebrow,
  title,
  description,
  lastUpdated,
  icon: Icon,
  accent = "emerald",
  sections,
}: LegalPageProps) {
  const styles = accentStyles[accent];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] bg-size-[24px_24px]"
          aria-hidden="true"
        />
        <div
          className={cn(
            "pointer-events-none absolute -top-32 right-0 size-96 rounded-full blur-[120px]",
            styles.glow,
          )}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-400"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span className="text-slate-300">{title}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                  styles.badge,
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {eyebrow}
              </div>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                {description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <CalendarDays
                className="size-5 text-slate-400"
                aria-hidden="true"
              />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Last updated
                </p>
                <p className="text-sm font-semibold">{lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-24">
            <LegalToc
              sections={sections.map(({ id, title: sectionTitle }) => ({
                id,
                title: sectionTitle,
              }))}
            />
          </aside>

          <article className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-800 sm:px-8">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl ring-1",
                      styles.marker,
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {eyebrow}
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {sections.length} sections
                </p>
              </div>

              <div className="px-6 py-8 sm:px-8 sm:py-10">
                {sections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className={cn(
                      "scroll-mt-24",
                      index > 0 &&
                        "mt-10 border-t border-slate-100 pt-10 dark:border-slate-800/80",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ring-1",
                          styles.marker,
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                    <div className="mt-3 space-y-3 pl-10 text-sm leading-7 text-slate-600 dark:text-slate-300 [&_a]:font-medium [&_a]:text-emerald-600 [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-emerald-400 [&_li]:ml-1 [&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

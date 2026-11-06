import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/modules/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the SafePath team for help with your account, incident reports, safety concerns, or partnerships.",
};

const quickLinks = [
  {
    href: "/incidents",
    label: "Browse the incident feed",
    description: "See verified reports in your community.",
  },
  {
    href: "/community-guidelines",
    label: "Community Guidelines",
    description: "Understand what belongs on SafePath.",
  },
  {
    href: "/terms-of-service",
    label: "Terms of Service",
    description: "Review the rules for using the platform.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.14),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          {/* <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            <Link
              href="/"
              className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Home
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-slate-700 dark:text-slate-300">Contact</span>
          </nav> */}

          <div className="mt-6 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <MessageSquare className="size-3.5" aria-hidden="true" />
              Contact SafePath
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              We&apos;re here to help
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              Questions about your account, an incident report, or keeping your
              community safe? Send us a message and a real person will get back
              to you.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <ContactForm />

          <aside className="flex flex-col gap-5">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                Response time
              </h2>
              <p className="mt-2 text-sm leading-relaxed dark:text-slate-400">
                We reply within 1-2 business days, Monday to Friday. Messages
                sent on weekends or public holidays are answered on the next
                business day.
              </p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  Help us help you faster
                </p>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-2">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-emerald-500"
                      aria-hidden="true"
                    />
                    Include the incident area or a link to the report.
                  </li>
                  <li className="flex gap-2">
                    <MessageSquare
                      className="mt-0.5 size-4 shrink-0 text-emerald-500"
                      aria-hidden="true"
                    />
                    Use the email address linked to your account.
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/60 dark:bg-rose-950/30">
              <span className="flex size-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-rose-900 dark:text-rose-200">
                In an emergency
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-rose-800/80 dark:text-rose-200/70">
                SafePath is not an emergency service and our inbox is not
                monitored around the clock. If you or someone else is in
                immediate danger, contact your local emergency number right
                away.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <BookOpen
                  className="size-4 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <h2 className="text-sm font-bold uppercase tracking-widest dark:text-slate-400">
                  Quick links
                </h2>
              </div>
              <ul className="mt-4 flex flex-col gap-1">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-start justify-between gap-3 rounded-2xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-950"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {link.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                          {link.description}
                        </span>
                      </span>
                      <ArrowRight
                        className="mt-1 size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

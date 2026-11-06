import {
  ArrowRight,
  CheckCircle2,
  Compass,
  MapPin,
  PlusCircle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/public/header";

const features = [
  {
    icon: Siren,
    title: "Instant Incident Reporting",
    description:
      "Submit geo-tagged incident reports with categories, descriptions, and media in under 60 seconds.",
    badge: "Fast & Precise",
  },
  {
    icon: ShieldCheck,
    title: "Verified by Moderators",
    description:
      "Every community report undergoes structured review by moderators before appearing on public feeds.",
    badge: "100% Verified",
  },
  {
    icon: Zap,
    title: "Real-Time Local Intelligence",
    description:
      "Stay ahead with live updates, area filters, and critical community hazard notifications.",
    badge: "Live Updates",
  },
];

const steps = [
  {
    step: "01",
    title: "Witness or identify",
    desc: "Observe a safety concern, theft, harassment, or unsafe area in your neighborhood.",
  },
  {
    step: "02",
    title: "Submit in seconds",
    desc: "Provide the location, category, and details through our quick reporting flow.",
  },
  {
    step: "03",
    title: "Protect your community",
    desc: "Verified updates alert neighbors and authorities to take timely preventive action.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sticky Navigation Header */}
      <Header />

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32 text-white">
          {/* Background Grid Pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px]"
            aria-hidden="true"
          />

          {/* Radial Emerald Glow */}
          <div
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-emerald-500/15 blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 right-10 size-[400px] rounded-full bg-slate-800/40 blur-[100px]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md mb-8">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SafePath Live Community Network</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-balance leading-tight sm:leading-none">
              Safety awareness starts with a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                single report.
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 text-balance leading-relaxed">
              Empowering citizens and neighborhoods with verified, crowd-sourced safety intelligence. Report hazards, track local alerts, and safeguard your streets together.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                <PlusCircle className="size-4" />
                <span>Get started free</span>
              </Link>
              <Link
                href="/incidents"
                className="inline-flex items-center gap-2.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:text-white transition-all backdrop-blur-sm hover:-translate-y-0.5"
              >
                <Compass className="size-4 text-emerald-400" />
                <span>Browse live incidents</span>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 border-t border-slate-800/80 pt-10 text-slate-400">
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  100%
                </span>
                <span className="text-xs mt-1 uppercase tracking-wider font-medium text-slate-400">
                  Moderator Verified
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  &lt; 1 min
                </span>
                <span className="text-xs mt-1 uppercase tracking-wider font-medium text-slate-400">
                  Quick Report Flow
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  24 / 7
                </span>
                <span className="text-xs mt-1 uppercase tracking-wider font-medium text-slate-400">
                  Continuous Monitoring
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Core Capabilities
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Engineered for civic accountability and rapid response
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="size-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3-STEP PROCESS SECTION */}
        <section className="py-20 sm:py-28 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Simple & Transparent
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                How SafePath works
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="flex flex-col rounded-3xl border border-slate-200/60 p-8 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20"
                >
                  <span className="text-4xl font-black text-emerald-500/30 mb-4">
                    {item.step}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section className="py-16 sm:py-20 bg-slate-900 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to create a safer environment?
            </h2>
            <p className="mt-4 max-w-xl text-slate-300 text-sm sm:text-base">
              Join thousands of neighbors actively reporting and keeping their areas secure.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Create an account</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">SafePath</span>
            <span>· Community safety platform</span>
          </div>
          <p>&copy; 2026 SafePath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

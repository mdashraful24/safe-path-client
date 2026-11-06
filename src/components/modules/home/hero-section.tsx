import { Compass, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)]">
      <div className="relative flex w-full flex-col overflow-hidden bg-slate-900 text-white">
        {/* Background Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] bg-size-[24px_24px]"
          aria-hidden="true"
        />

        {/* Radial Emerald Glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-150 rounded-full bg-emerald-500/15 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 right-10 size-100 rounded-full bg-slate-800/40 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 text-center">
          {/* Live Indicator Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md mb-8">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SafePath Live Community Network</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-balance leading-tight sm:leading-none">
            Safety awareness starts with a{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-200">
              single report.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 text-balance leading-relaxed">
            Empowering citizens and neighborhoods with verified, crowd-sourced
            safety intelligence. Report hazards, track local alerts, and
            safeguard your streets together.
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
      </div>
    </section>
  );
}

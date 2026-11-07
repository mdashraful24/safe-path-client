import Logo from "@/components/brand/logo";
import ThemeToggle from "@/components/theme-toggle";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <aside className="relative hidden overflow-hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between bg-slate-900 p-10">
        {/* Dot-grid SVG overlay */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dot-grid"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>

        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-900/30 via-transparent to-slate-900/0" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo className="[&_span]:text-white [&_span_span]:text-emerald-400" />
        </div>

        {/* Center branding */}
        <div className="relative z-10 flex flex-col gap-6">
          {/* Animated location badge */}
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/40">
              <svg
                aria-hidden="true"
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 2C11.03 2 7 6.03 7 11C7 17.5 16 30 16 30C16 30 25 17.5 25 11C25 6.03 20.97 2 16 2Z"
                  fill="#10b981"
                />
                <circle cx="16" cy="11" r="4" fill="white" />
                <circle cx="16" cy="11" r="1.8" fill="#10b981" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                SafePath Platform
              </p>
            </div>
          </div>

          <h2 className="max-w-sm text-4xl font-bold leading-tight tracking-tight text-white">
            Safety awareness starts with a{" "}
            <span className="text-emerald-400">report.</span>
          </h2>

          <p className="max-w-sm text-md leading-relaxed text-slate-300">
            Join thousands of community members reporting incidents and
            following verified safety updates in real time.
          </p>

          {/* Feature highlights */}
          <div className="mt-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className="text-sm text-slate-300">Report Incidents</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </span>
              <span className="text-sm text-slate-300">Real-time Updates</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <span className="text-sm text-slate-300">Community Safety</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-slate-300">
          &copy; 2026 SafePath. All rights reserved.
        </p>
      </aside>

      {/* ── Right panel ── */}
      <main className="relative flex flex-1 items-center justify-center bg-white p-6 py-12 dark:bg-slate-950">
        <Logo className="absolute left-4 top-4 sm:left-6 sm:top-6 lg:hidden" />
        <ThemeToggle className="absolute right-4 top-4 sm:right-6 sm:top-6" />
        <div className="w-full max-w-100 px-2">{children}</div>
      </main>
    </div>
  );
}

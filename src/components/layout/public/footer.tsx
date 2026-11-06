import Link from "next/link";
import Logo from "@/components/brand/logo";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Live Incidents", href: "/incidents" },
      { label: "Report an Incident", href: "/dashboard/incidents/new" },
      { label: "My Reports", href: "/dashboard/incidents" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
      { label: "Verify Account", href: "/register/verify-account" },
      { label: "Profile Settings", href: "/dashboard/profile" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Community Guidelines", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 dark:border-slate-800/80 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12 lg:py-16">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A community-powered platform for reporting and tracking verified
              local safety incidents in real time.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live community network
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {section.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200/80 py-6 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; 2026 SafePath. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Built for safer communities.
          </p>
        </div>
      </div>
    </footer>
  );
}

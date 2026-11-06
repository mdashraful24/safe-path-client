import { ShieldCheck, Siren, Zap } from "lucide-react";

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

export default function FeaturesSection() {
  return (
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
  );
}

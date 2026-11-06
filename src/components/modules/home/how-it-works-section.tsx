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

export default function HowItWorksSection() {
  return (
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
  );
}

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Ready to create a safer environment?
        </h2>
        <p className="mt-4 max-w-xl text-slate-300 text-lg">
          Join thousands of neighbors actively reporting and keeping their areas
          secure.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 px-8 py-3.5 text-md font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            <span>Create an account</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

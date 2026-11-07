import { ArrowLeft, Home, MapPinOff } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <title>Page Not Found | SafePath</title>
      <header className="border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6">
          <Logo />
        </div>
      </header>

      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
        <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-lg flex-col items-center text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <MapPinOff className="size-10" aria-hidden="true" />
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
            Error 404
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-500 dark:text-slate-400">
            We couldn&apos;t find the page you&apos;re looking for. It may have
            moved, been removed, or the address may be incorrect.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              <Home className="size-4" aria-hidden="true" />
              Go to homepage
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Go back
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import { type ReactNode, Suspense } from "react";
import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";

export default function IncidentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950 font-sans">
      <Suspense
        fallback={
          <div className="sticky top-0 z-50 h-16 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/85" />
        }
      >
        <Header />
      </Suspense>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}

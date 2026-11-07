import type { Metadata } from "next";
import { type ReactNode, Suspense } from "react";
import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";
import { HeaderSkeleton } from "@/components/skeletons/layout-skeletons";

export const metadata: Metadata = {
  title: "Incident Feed",
};

export default function IncidentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950 font-sans">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}

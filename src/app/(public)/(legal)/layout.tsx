import { type ReactNode, Suspense } from "react";
import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";
import { HeaderSkeleton } from "@/components/skeletons/layout-skeletons";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 font-sans dark:bg-slate-950">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

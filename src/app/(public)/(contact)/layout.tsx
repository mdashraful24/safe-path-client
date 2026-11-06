import { Suspense } from "react";
import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";

function HeaderFallback() {
  return (
    <div className="h-16 w-full border-b border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-950" />
  );
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

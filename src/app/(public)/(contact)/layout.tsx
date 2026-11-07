import { Suspense } from "react";
import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";
import { HeaderSkeleton } from "@/components/skeletons/layout-skeletons";

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

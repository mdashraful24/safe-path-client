"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import DashboardTopbar from "@/components/layout/dashboard-topbar";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans">
      {/* Left Sidebar */}
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Sticky Top Bar */}
        <DashboardTopbar onMobileMenuOpen={() => setMobileOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isAuthReady } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthReady, isAuthenticated, router]);

  if (!isAuthReady || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar openSidebar={() => setIsSidebarOpen(true)} />

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

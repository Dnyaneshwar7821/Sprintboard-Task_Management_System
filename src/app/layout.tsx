import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import AppProviders from "@/providers/AppProviders";

export const metadata: Metadata = {
  title: "SprintBoard",
  description: "Task & Team Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <AppProviders>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />

          {children}
        </AppProviders>
      </body>
    </html>
  );
}

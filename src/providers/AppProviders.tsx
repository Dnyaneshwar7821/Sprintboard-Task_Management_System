"use client";

import { ReactNode } from "react";

import { AuthProvider } from "@/context/AuthContext";
import { MemberProvider } from "@/context/MemberContext";
import { TaskProvider } from "@/context/TaskContext";

import ThemeProvider from "./ThemeProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TaskProvider>
          <MemberProvider>{children}</MemberProvider>
        </TaskProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

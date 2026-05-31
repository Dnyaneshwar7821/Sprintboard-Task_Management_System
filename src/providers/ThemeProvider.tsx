"use client";

import { ReactNode } from "react";
import { ThemeProvider as AppThemeProvider } from "@/context/ThemeContext";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return <AppThemeProvider>{children}</AppThemeProvider>;
}

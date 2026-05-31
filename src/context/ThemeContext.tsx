"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ThemeContextType {
  darkMode: boolean;
  isThemeReady: boolean;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "sprintboard-theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialDarkMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;

  document.documentElement.classList.toggle("dark", shouldUseDark);

  return shouldUseDark;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  const toggleTheme = () => {
    setDarkMode((currentValue) => {
      const nextValue = !currentValue;

      document.documentElement.classList.toggle("dark", nextValue);
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        nextValue ? "dark" : "light",
      );

      return nextValue;
    });
  };

  const value = useMemo(
    () => ({
      darkMode,
      isThemeReady: true,
      toggleTheme,
    }),
    [darkMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

"use client";

import { useRouter } from "next/navigation";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  openSidebar: () => void;
}

export default function Navbar({ openSidebar }: NavbarProps) {
  const router = useRouter();

  const { logout, user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-4 shadow dark:bg-slate-900 dark:text-white sm:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          onClick={openSidebar}
          aria-label="Open sidebar"
        >
          <FaBars size={20} />
        </button>

        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Dashboard
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          {darkMode ? "Light" : "Dark"}
        </button>

        <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline">
          Welcome, {user?.name ?? "User"}
          {user?.role ? ` (${user.role})` : ""}
        </span>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

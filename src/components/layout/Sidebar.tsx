"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaTasks, FaTimes, FaUser, FaUsers } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: FaHome },
    { href: "/tasks", label: "Tasks", icon: FaTasks },
    { href: "/members", label: "Members", icon: FaUsers },
    { href: "/profile", label: "Profile", icon: FaUser },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 min-h-screen w-64 shrink-0 transform bg-slate-900 p-5 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold">SprintBoard</h1>

          <button
            type="button"
            className="rounded-lg p-2 hover:bg-slate-800 lg:hidden"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

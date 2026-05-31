import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 ${className}`}
    >
      {children}
    </button>
  );
}

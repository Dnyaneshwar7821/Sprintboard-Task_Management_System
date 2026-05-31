import type { InputHTMLAttributes } from "react";

export default function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white ${className}`}
    />
  );
}

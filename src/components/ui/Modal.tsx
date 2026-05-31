import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  children: ReactNode;
}

export default function Modal({ open, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}

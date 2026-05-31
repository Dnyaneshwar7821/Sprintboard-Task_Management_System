"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useTaskContext } from "@/context/TaskContext";
import { deleteRegisteredUser, isRegisteredUser } from "@/services/auth";
import { normalizeIdentity } from "@/utils/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { tasks } = useTaskContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const assignedTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          normalizeIdentity(task.assignedUser) === normalizeIdentity(user?.name),
      ),
    [tasks, user?.name],
  );

  const canDeleteAccount = user ? isRegisteredUser(user.email) : false;

  const handleDeleteAccount = () => {
    if (!user || !canDeleteAccount) {
      toast.error("Demo accounts cannot be deleted");
      return;
    }

    const shouldDelete = window.confirm(
      "Delete your account? This removes your registered login from this browser.",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);

    const deleted = deleteRegisteredUser(user.email);

    if (!deleted) {
      setIsDeleting(false);
      toast.error("Unable to delete this account");
      return;
    }

    toast.success("Account deleted");
    logout();
    router.replace("/login");
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900 lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
            Profile
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
            {user?.name}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Review your account details and assigned work.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Email
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {user?.email}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Role
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {user?.role}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Assigned Tasks
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {assignedTasks.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Account Type
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {canDeleteAccount ? "Registered account" : "Demo account"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Account Actions
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Registered users can remove their account from this browser. Demo
            accounts are protected for project review.
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={!canDeleteAccount || isDeleting}
            className="mt-6 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
}

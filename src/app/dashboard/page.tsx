"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";

import { useAuth } from "@/context/AuthContext";
import { useMemberContext } from "@/context/MemberContext";
import { useTaskContext } from "@/context/TaskContext";
import type { Task } from "@/types/task";
import { isAdminRole, normalizeIdentity } from "@/utils/auth";

const statusColors: Record<Task["status"], string> = {
  Pending: "bg-amber-500",
  "In Progress": "bg-blue-500",
  Completed: "bg-emerald-500",
};

const priorityColors: Record<Task["priority"], string> = {
  High: "bg-red-500",
  Medium: "bg-purple-500",
  Low: "bg-slate-500",
};

export default function DashboardPage() {
  const { tasks } = useTaskContext();
  const { members } = useMemberContext();
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role);

  const visibleTasks = isAdmin
    ? tasks
    : tasks.filter(
        (task) =>
          normalizeIdentity(task.assignedUser) === normalizeIdentity(user?.name),
      );

  const completedTasks = visibleTasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const pendingTasks = visibleTasks.filter(
    (task) => task.status !== "Completed",
  ).length;

  const statusSummary = (["Pending", "In Progress", "Completed"] as const).map(
    (status) => ({
      label: status,
      value: visibleTasks.filter((task) => task.status === status).length,
      color: statusColors[status],
    }),
  );

  const prioritySummary = (["High", "Medium", "Low"] as const).map(
    (priority) => ({
      label: priority,
      value: visibleTasks.filter((task) => task.priority === priority).length,
      color: priorityColors[priority],
    }),
  );

  const recentTasks = [...visibleTasks]
    .sort((firstTask, secondTask) =>
      secondTask.dueDate.localeCompare(firstTask.dueDate),
    )
    .slice(0, 4);

  const taskTotal = Math.max(visibleTasks.length, 1);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={isAdmin ? "Total Tasks" : "My Tasks"}
          value={visibleTasks.length}
          href="/tasks"
        />

        <StatsCard title="Completed" value={completedTasks} href="/tasks" />

        <StatsCard title="Pending" value={pendingTasks} href="/tasks" />

        <StatsCard
          title={isAdmin ? "Members" : "Team Size"}
          value={members.length}
          href="/members"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                Task Progress
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isAdmin ? "Overall workload" : "Your assigned workload"}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {visibleTasks.length} tasks
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {statusSummary.map((item) => {
              const width = `${Math.round((item.value / taskTotal) * 100)}%`;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {item.label}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Priority Split
          </h2>
          <div className="mt-6 flex h-52 items-end gap-4">
            {prioritySummary.map((item) => {
              const height = `${Math.max(8, (item.value / taskTotal) * 100)}%`;

              return (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-36 w-full items-end rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                    <div
                      className={`w-full rounded-md ${item.color}`}
                      style={{ height }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              Recent Work
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Latest tasks by due date
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {recentTasks.length ? (
            recentTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {task.assignedUser} - Due {task.dueDate}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {task.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400 md:col-span-2">
              No assigned tasks yet.
            </p>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

"use client";

import { useMemo, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import TaskTable from "@/components/tasks/TaskTable";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskForm from "@/components/tasks/TaskForm";
import Pagination from "@/components/tasks/Pagination";

import { useAuth } from "@/context/AuthContext";
import { useTaskContext } from "@/context/TaskContext";
import type { Task } from "@/types/task";
import { isAdminRole, normalizeIdentity } from "@/utils/auth";
import { ITEMS_PER_PAGE } from "@/utils/constants";

export default function TasksPage() {
  const { tasks } = useTaskContext();
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const roleTasks = useMemo(
    () =>
      isAdmin
        ? tasks
        : tasks.filter(
            (task) =>
              normalizeIdentity(task.assignedUser) ===
              normalizeIdentity(user?.name),
          ),
    [isAdmin, tasks, user?.name],
  );

  const filteredTasks = useMemo(
    () =>
      roleTasks.filter((task) => {
        const normalizedSearch = search.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(normalizedSearch) ||
          task.assignedUser.toLowerCase().includes(normalizedSearch) ||
          task.description.toLowerCase().includes(normalizedSearch);

        const matchesStatus = status === "" || task.status === status;

        const matchesPriority = priority === "" || task.priority === priority;

        return matchesSearch && matchesStatus && matchesPriority;
      }),
    [priority, roleTasks, search, status],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTasks.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const updateSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const updateStatus = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const updatePriority = (value: string) => {
    setPriority(value);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold text-slate-950 dark:text-white">
        {isAdmin ? "Tasks" : "My Tasks"}
      </h1>

      {isAdmin && (
        <TaskForm
          key={editingTask?.id ?? "new-task"}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />
      )}

      <TaskFilters
        search={search}
        setSearch={updateSearch}
        status={status}
        setStatus={updateStatus}
        priority={priority}
        setPriority={updatePriority}
      />

      <TaskTable
        tasks={paginatedTasks}
        canManageTasks={isAdmin}
        canUpdateStatus={!isAdmin}
        onEditTask={setEditingTask}
      />

      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </DashboardLayout>
  );
}

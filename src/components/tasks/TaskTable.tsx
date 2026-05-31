"use client";

import { useTaskContext } from "@/context/TaskContext";
import type { Task } from "@/types/task";

interface TaskTableProps {
  tasks: Task[];
  canManageTasks: boolean;
  canUpdateStatus: boolean;
  onEditTask: (task: Task) => void;
}

export default function TaskTable({
  tasks,
  canManageTasks,
  canUpdateStatus,
  onEditTask,
}: TaskTableProps) {
  const { deleteTask, updateTaskStatus } = useTaskContext();

  const showActions = canManageTasks || canUpdateStatus;
  const columnCount = showActions ? 6 : 5;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow dark:bg-slate-900">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Assigned To</th>
              <th className="p-4 text-left">Due Date</th>
              {showActions && <th className="p-4 text-left">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {tasks.length ? (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="text-slate-700 dark:text-slate-200"
                >
                  <td className="p-4 font-medium text-slate-950 dark:text-white">
                    {task.title}
                  </td>
                  <td className="p-4">{task.priority}</td>
                  <td className="p-4">{task.status}</td>
                  <td className="p-4">{task.assignedUser}</td>
                  <td className="p-4">{task.dueDate}</td>
                  {showActions && (
                    <td className="p-4">
                      {canManageTasks ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onEditTask(task)}
                            className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTaskStatus(
                              task.id,
                              e.target.value as Task["status"],
                            )
                          }
                          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columnCount}
                  className="p-6 text-center text-slate-500 dark:text-slate-400"
                >
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

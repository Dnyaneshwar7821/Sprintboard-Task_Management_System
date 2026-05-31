"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useMemberContext } from "@/context/MemberContext";
import { useTaskContext } from "@/context/TaskContext";
import type { Task } from "@/types/task";

interface TaskFormProps {
  editingTask: Task | null;
  onCancelEdit: () => void;
}

const defaultTaskValues = {
  title: "",
  description: "",
  priority: "Medium" as Task["priority"],
  status: "Pending" as Task["status"],
  assignedUser: "",
  dueDate: "",
};

export default function TaskForm({
  editingTask,
  onCancelEdit,
}: TaskFormProps) {
  const { addTask, updateTask } = useTaskContext();
  const { members } = useMemberContext();

  const [title, setTitle] = useState(
    editingTask?.title ?? defaultTaskValues.title,
  );
  const [description, setDescription] = useState(
    editingTask?.description ?? defaultTaskValues.description,
  );
  const [priority, setPriority] = useState<Task["priority"]>(
    editingTask?.priority ?? defaultTaskValues.priority,
  );
  const [status, setStatus] = useState<Task["status"]>(
    editingTask?.status ?? defaultTaskValues.status,
  );
  const [assignedUser, setAssignedUser] = useState(
    editingTask?.assignedUser ?? defaultTaskValues.assignedUser,
  );
  const [dueDate, setDueDate] = useState(
    editingTask?.dueDate ?? defaultTaskValues.dueDate,
  );

  const resetForm = () => {
    setTitle(defaultTaskValues.title);
    setDescription(defaultTaskValues.description);
    setPriority(defaultTaskValues.priority);
    setStatus(defaultTaskValues.status);
    setAssignedUser(defaultTaskValues.assignedUser);
    setDueDate(defaultTaskValues.dueDate);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !assignedUser.trim() || !dueDate) {
      toast.error("Please fill in title, assignee, and due date");
      return;
    }

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignedUser: assignedUser.trim(),
      dueDate,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskPayload);
      toast.success("Task updated successfully");
      onCancelEdit();
    } else {
      addTask(taskPayload);
      toast.success("Task added successfully");
      resetForm();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:p-6"
    >
      <h2 className="mb-4 text-xl font-semibold text-slate-950 dark:text-white">
        {editingTask ? "Edit Task" : "Add Task"}
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />

        <select
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="">Assign to member</option>
          {members.map((member) => (
            <option key={member.id} value={member.name}>
              {member.name}
            </option>
          ))}
          {assignedUser &&
            !members.some((member) => member.name === assignedUser) && (
              <option value={assignedUser}>{assignedUser}</option>
            )}
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task["priority"])}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-slate-950 px-5 py-2 font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-300 px-5 py-2 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

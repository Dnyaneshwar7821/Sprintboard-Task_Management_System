"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { tasks as initialTasks } from "@/data/tasks";
import { Task } from "@/types/task";

const TASK_STORAGE_KEY = "sprintboard-tasks";
const TASK_CHANGE_EVENT = "sprintboard-tasks-change";
const INITIAL_TASKS_SNAPSHOT = JSON.stringify(initialTasks);

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number, task: Omit<Task, "id">) => void;
  updateTaskStatus: (id: number, status: Task["status"]) => void;
  deleteTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const parseTasks = (storedTasks: string | null) => {
  if (!storedTasks) {
    return initialTasks;
  }

  try {
    return JSON.parse(storedTasks) as Task[];
  } catch {
    window.localStorage.removeItem(TASK_STORAGE_KEY);
    return initialTasks;
  }
};

const getTaskSnapshot = () => {
  if (typeof window === "undefined") {
    return INITIAL_TASKS_SNAPSHOT;
  }

  return window.localStorage.getItem(TASK_STORAGE_KEY) ?? INITIAL_TASKS_SNAPSHOT;
};

const subscribeToTasks = (onStoreChange: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === TASK_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(TASK_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(TASK_CHANGE_EVENT, onStoreChange);
  };
};

const saveTasks = (tasks: Task[]) => {
  window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new Event(TASK_CHANGE_EVENT));
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const storedTasks = useSyncExternalStore(
    subscribeToTasks,
    getTaskSnapshot,
    () => INITIAL_TASKS_SNAPSHOT,
  );

  const tasks = useMemo(() => parseTasks(storedTasks), [storedTasks]);

  const addTask = useCallback(
    (task: Omit<Task, "id">) => {
      saveTasks([
        ...tasks,
        {
          ...task,
          id: tasks.length
            ? Math.max(...tasks.map((currentTask) => currentTask.id)) + 1
            : 1,
        },
      ]);
    },
    [tasks],
  );

  const updateTask = useCallback(
    (id: number, task: Omit<Task, "id">) => {
      saveTasks(
        tasks.map((currentTask) =>
          currentTask.id === id ? { ...task, id } : currentTask,
        ),
      );
    },
    [tasks],
  );

  const updateTaskStatus = useCallback(
    (id: number, status: Task["status"]) => {
      saveTasks(
        tasks.map((currentTask) =>
          currentTask.id === id ? { ...currentTask, status } : currentTask,
        ),
      );
    },
    [tasks],
  );

  const deleteTask = useCallback(
    (id: number) => {
      saveTasks(tasks.filter((task) => task.id !== id));
    },
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
    }),
    [addTask, deleteTask, tasks, updateTask, updateTaskStatus],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTaskContext must be used within TaskProvider");
  }

  return context;
}

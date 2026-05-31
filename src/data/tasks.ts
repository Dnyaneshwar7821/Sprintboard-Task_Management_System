import { Task } from "@/types/task";

export const tasks: Task[] = [
  {
    id: 1,
    title: "Design Login Page",
    description: "Create responsive login page",
    priority: "High",
    status: "Completed",
    assignedUser: "Rahul Sharma",
    dueDate: "2026-06-01",
  },
  {
    id: 2,
    title: "Build Dashboard",
    description: "Develop dashboard statistics cards",
    priority: "High",
    status: "In Progress",
    assignedUser: "Priya Patel",
    dueDate: "2026-06-03",
  },
  {
    id: 3,
    title: "Create Task Module",
    description: "Implement CRUD functionality",
    priority: "Medium",
    status: "Pending",
    assignedUser: "Amit Kumar",
    dueDate: "2026-06-05",
  },
  {
    id: 4,
    title: "Team Members Page",
    description: "Display all members",
    priority: "Low",
    status: "Pending",
    assignedUser: "Sneha Joshi",
    dueDate: "2026-06-07",
  },
];
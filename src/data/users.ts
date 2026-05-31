import { User } from "@/types/user";

export const users: User[] = [
  {
    id: 1,
    email: "admin@sprintboard.com",
    passwordHash:
      "6f2cb9dd8f4b65e24e1c3f3fa5bc57982349237f11abceacd45bbcb74d621c25",
    name: "Admin",
    role: "Administrator",
  },
  {
    id: 2,
    email: "user@sprintboard.com",
    passwordHash:
      "e7f5c00bfc7067a49da98fa9b1eacd8d428a4632197edaa84c9dacd40ca35050",
    name: "Rahul Sharma",
    role: "Frontend Developer",
  },
];

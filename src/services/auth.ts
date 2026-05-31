import { users } from "@/data/users";
import type { User } from "@/types/user";

type AuthUser = Omit<User, "passwordHash">;
type RegisterUserInput = Pick<User, "email" | "name"> & {
  password: string;
};

const REGISTERED_USERS_KEY = "sprintboard-registered-users";

const toAuthUser = (user: User): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

const hashPassword = async (password: string) => {
  const encodedPassword = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", encodedPassword);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const getRegisteredUsers = (): User[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedUsers = window.localStorage.getItem(REGISTERED_USERS_KEY);

  if (!storedUsers) {
    return [];
  }

  try {
    return JSON.parse(storedUsers) as User[];
  } catch {
    window.localStorage.removeItem(REGISTERED_USERS_KEY);
    return [];
  }
};

const saveRegisteredUsers = (registeredUsers: User[]) => {
  window.localStorage.setItem(
    REGISTERED_USERS_KEY,
    JSON.stringify(registeredUsers),
  );
};

const getAllUsers = () => [...users, ...getRegisteredUsers()];

export const loginUser = async (email: string, password: string) => {
  const passwordHash = await hashPassword(password);
  const normalizedEmail = email.trim().toLowerCase();

  const user = getAllUsers().find(
    (currentUser) =>
      currentUser.email.toLowerCase() === normalizedEmail &&
      currentUser.passwordHash === passwordHash,
  );

  return user ? toAuthUser(user) : null;
};

export const registerUser = async ({
  email,
  name,
  password,
}: RegisterUserInput) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = getAllUsers().find(
    (currentUser) => currentUser.email.toLowerCase() === normalizedEmail,
  );

  if (existingUser) {
    return {
      user: null,
      error: "An account with this email already exists",
    };
  }

  const registeredUsers = getRegisteredUsers();
  const nextUser: User = {
    id:
      getAllUsers().reduce(
        (highestId, currentUser) => Math.max(highestId, currentUser.id),
        0,
      ) + 1,
    email: normalizedEmail,
    name: name.trim(),
    passwordHash: await hashPassword(password),
    role: "Team Member",
  };

  saveRegisteredUsers([...registeredUsers, nextUser]);

  return {
    user: toAuthUser(nextUser),
    error: null,
  };
};

export const isRegisteredUser = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  return getRegisteredUsers().some(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );
};

export const deleteRegisteredUser = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const registeredUsers = getRegisteredUsers();
  const nextRegisteredUsers = registeredUsers.filter(
    (user) => user.email.toLowerCase() !== normalizedEmail,
  );

  if (nextRegisteredUsers.length === registeredUsers.length) {
    return false;
  }

  saveRegisteredUsers(nextRegisteredUsers);
  return true;
};

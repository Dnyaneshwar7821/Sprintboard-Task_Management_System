"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { User } from "@/types/user";

type AuthUser = Omit<User, "passwordHash">;

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "sprintboard-auth-user";
const AUTH_CHANGE_EVENT = "sprintboard-auth-change";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseStoredUser = (storedUser: string | null) => {
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const getAuthSnapshot = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY);
};

const subscribeToAuth = (onStoreChange: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === AUTH_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  };
};

const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

const subscribeToHydration = () => () => undefined;

export function AuthProvider({ children }: { children: ReactNode }) {
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const storedUser = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    () => null,
  );

  const user = useMemo(() => parseStoredUser(storedUser), [storedUser]);

  const login = useCallback((nextUser: AuthUser) => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    notifyAuthChange();
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    notifyAuthChange();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthReady: isHydrated,
      login,
      logout,
    }),
    [isHydrated, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { members as initialMembers } from "@/data/members";
import { Member } from "@/types/member";

const MEMBER_STORAGE_KEY = "sprintboard-members";
const MEMBER_CHANGE_EVENT = "sprintboard-members-change";
const INITIAL_MEMBERS_SNAPSHOT = JSON.stringify(initialMembers);

interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, "id">) => void;
  updateMember: (id: number, member: Omit<Member, "id">) => void;
  deleteMember: (id: number) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const parseMembers = (storedMembers: string | null) => {
  if (!storedMembers) {
    return initialMembers;
  }

  try {
    return JSON.parse(storedMembers) as Member[];
  } catch {
    window.localStorage.removeItem(MEMBER_STORAGE_KEY);
    return initialMembers;
  }
};

const getMemberSnapshot = () => {
  if (typeof window === "undefined") {
    return INITIAL_MEMBERS_SNAPSHOT;
  }

  return (
    window.localStorage.getItem(MEMBER_STORAGE_KEY) ?? INITIAL_MEMBERS_SNAPSHOT
  );
};

const subscribeToMembers = (onStoreChange: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === MEMBER_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(MEMBER_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(MEMBER_CHANGE_EVENT, onStoreChange);
  };
};

const saveMembers = (members: Member[]) => {
  window.localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(members));
  window.dispatchEvent(new Event(MEMBER_CHANGE_EVENT));
};

export function MemberProvider({ children }: { children: ReactNode }) {
  const storedMembers = useSyncExternalStore(
    subscribeToMembers,
    getMemberSnapshot,
    () => INITIAL_MEMBERS_SNAPSHOT,
  );

  const members = useMemo(
    () => parseMembers(storedMembers),
    [storedMembers],
  );

  const addMember = useCallback(
    (member: Omit<Member, "id">) => {
      saveMembers([
        ...members,
        {
          ...member,
          id: members.length
            ? Math.max(...members.map((currentMember) => currentMember.id)) + 1
            : 1,
        },
      ]);
    },
    [members],
  );

  const updateMember = useCallback(
    (id: number, member: Omit<Member, "id">) => {
      saveMembers(
        members.map((currentMember) =>
          currentMember.id === id ? { ...member, id } : currentMember,
        ),
      );
    },
    [members],
  );

  const deleteMember = useCallback(
    (id: number) => {
      saveMembers(members.filter((member) => member.id !== id));
    },
    [members],
  );

  const value = useMemo(
    () => ({
      members,
      addMember,
      updateMember,
      deleteMember,
    }),
    [addMember, deleteMember, members, updateMember],
  );

  return (
    <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
  );
}

export function useMemberContext() {
  const context = useContext(MemberContext);

  if (!context) {
    throw new Error("useMemberContext must be used within MemberProvider");
  }

  return context;
}

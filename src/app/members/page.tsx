"use client";

import { useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MemberTable from "@/components/members/MemberTable";
import MemberForm from "@/components/members/MemberForm";

import { useAuth } from "@/context/AuthContext";
import { useMemberContext } from "@/context/MemberContext";
import type { Member } from "@/types/member";
import { isAdminRole } from "@/utils/auth";

export default function MembersPage() {
  const { members } = useMemberContext();
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold text-slate-950 dark:text-white">
        Team Members
      </h1>

      {!isAdmin && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
          You can view and add team members. Editing and deleting members is
          reserved for administrators.
        </div>
      )}

      <MemberForm
        key={editingMember?.id ?? "new-member"}
        editingMember={editingMember}
        onCancelEdit={() => setEditingMember(null)}
      />

      <MemberTable
        members={members}
        canManageMembers={isAdmin}
        onEditMember={setEditingMember}
      />
    </DashboardLayout>
  );
}

"use client";

import { useMemberContext } from "@/context/MemberContext";
import type { Member } from "@/types/member";

interface MemberTableProps {
  members: Member[];
  canManageMembers: boolean;
  onEditMember: (member: Member) => void;
}

export default function MemberTable({
  members,
  canManageMembers,
  onEditMember,
}: MemberTableProps) {
  const { deleteMember } = useMemberContext();
  const columnCount = canManageMembers ? 4 : 3;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow dark:bg-slate-900">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              {canManageMembers && <th className="p-4 text-left">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {members.length ? (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="text-slate-700 dark:text-slate-200"
                >
                  <td className="p-4 font-medium text-slate-950 dark:text-white">
                    {member.name}
                  </td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4">{member.role}</td>

                  {canManageMembers && (
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEditMember(member)}
                          className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMember(member.id)}
                          className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
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
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

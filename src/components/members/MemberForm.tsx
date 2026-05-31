"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useMemberContext } from "@/context/MemberContext";
import type { Member } from "@/types/member";
import { validateEmail } from "@/utils/validation";

interface MemberFormProps {
  editingMember: Member | null;
  onCancelEdit: () => void;
}

export default function MemberForm({
  editingMember,
  onCancelEdit,
}: MemberFormProps) {
  const { addMember, updateMember } = useMemberContext();

  const [name, setName] = useState(editingMember?.name ?? "");
  const [email, setEmail] = useState(editingMember?.email ?? "");
  const [role, setRole] = useState(editingMember?.role ?? "");

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !role.trim()) {
      toast.error("Please fill in all member details");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const memberPayload = {
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
    };

    if (editingMember) {
      updateMember(editingMember.id, memberPayload);
      toast.success("Member updated successfully");
      onCancelEdit();
    } else {
      addMember(memberPayload);
      toast.success("Member added successfully");
      resetForm();
    }
  };

  const inputClass =
    "rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:p-6"
    >
      <h2 className="mb-4 text-xl font-semibold text-slate-950 dark:text-white">
        {editingMember ? "Edit Member" : "Add Member"}
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />

        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-slate-950 px-5 py-2 font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {editingMember ? "Update Member" : "Add Member"}
        </button>

        {editingMember && (
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

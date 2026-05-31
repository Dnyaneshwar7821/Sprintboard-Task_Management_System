interface TaskFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
}

export default function TaskFilters({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
}: TaskFiltersProps) {
  const inputClass =
    "rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={inputClass}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={inputClass}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={inputClass}
      >
        <option value="">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
}

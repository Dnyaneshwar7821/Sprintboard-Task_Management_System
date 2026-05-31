interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const buttonClass =
    "rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800";

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => setCurrentPage(currentPage - 1)}
        className={buttonClass}
      >
        Previous
      </button>

      <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
        {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        disabled={isLastPage}
        onClick={() => setCurrentPage(currentPage + 1)}
        className={buttonClass}
      >
        Next
      </button>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasPrevPage, hasNextPage } = pagination;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <div className="hidden items-center gap-1 sm:flex">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? 'page' : undefined}
            className={`h-9 min-w-[36px] rounded-lg px-3 text-sm font-semibold transition ${
              pageNumber === page
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <span className="px-3 text-sm font-medium text-slate-600 sm:hidden">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

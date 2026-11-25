import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="self-start rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 sm:self-auto"
        >
          Try again
        </button>
      )}
    </div>
  );
}

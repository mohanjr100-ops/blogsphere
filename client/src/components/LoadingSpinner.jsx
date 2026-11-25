export default function LoadingSpinner({ label = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600"
        role="status"
        aria-label={label}
      />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-[60vh] items-center justify-center">{content}</div>;
  }

  return content;
}

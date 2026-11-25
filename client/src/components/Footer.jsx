export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6">
        <p className="font-medium text-slate-600">
          BlogSphere — Built for writers and thoughtful readers.
        </p>
        <p>© {new Date().getFullYear()} BlogSphere</p>
      </div>
    </footer>
  );
}

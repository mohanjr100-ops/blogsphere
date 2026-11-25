import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">404</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
      >
        Return Home
      </Link>
    </div>
  );
}

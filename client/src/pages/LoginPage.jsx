import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please check your credentials.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <LogIn className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to manage your posts and comments</p>
        </div>

        {error && (
          <div className="mb-5">
            <ErrorAlert message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

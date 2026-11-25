import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Menu, PenSquare, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/formatDate';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2.5 text-slate-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-bold tracking-tight">BlogSphere</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Explore
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard className="h-4 w-4" />
                My Posts
              </NavLink>
              <Link
                to="/posts/new"
                className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <PenSquare className="h-4 w-4" />
                Write
              </Link>
              <div className="ml-3 flex items-center gap-2.5 border-l border-slate-200 pl-3">
                <span
                  title={user?.email}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700"
                >
                  {getInitials(user?.name)}
                </span>
                <span className="max-w-[120px] truncate text-sm font-medium text-slate-700">
                  {user?.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Get started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1.5">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className={navLinkClass}>
              Explore
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  My Posts
                </NavLink>
                <NavLink
                  to="/posts/new"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <PenSquare className="h-4 w-4" />
                  Write a Post
                </NavLink>
                <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {getInitials(user?.name)}
                    </span>
                    <div className="text-sm">
                      <p className="font-medium text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

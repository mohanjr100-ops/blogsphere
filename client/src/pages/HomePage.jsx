import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, Search, X } from 'lucide-react';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: 6 };
      if (activeSearch) {
        params.search = activeSearch;
      }
      const { data } = await api.get('/posts', { params });
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load blog posts.'));
    } finally {
      setLoading(false);
    }
  }, [page, activeSearch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Hero section */}
      <section className="mb-10 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-7 shadow-sm sm:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              Community Publishing
            </span>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ideas worth reading, written by people who build and think.
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Explore the latest stories on BlogSphere, join discussions in the comments, or publish
              your own post in seconds.
            </p>
          </div>

          <Link
            to={isAuthenticated ? '/posts/new' : '/register'}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <PenSquare className="h-4 w-4" />
            {isAuthenticated ? 'Write a Post' : 'Start Writing'}
          </Link>
        </div>
      </section>

      {/* Toolbar: heading + search */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {activeSearch ? `Search results for "${activeSearch}"` : 'Latest Posts'}
          </h2>
          {pagination && !loading && (
            <p className="mt-0.5 text-xs text-slate-500">
              Showing {posts.length} of {pagination.totalPosts} post
              {pagination.totalPosts === 1 ? '' : 's'}
            </p>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2 sm:w-80">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search posts..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onRetry={fetchPosts} />
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading latest posts..." />
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h3 className="text-base font-semibold text-slate-900">
            {activeSearch ? 'No matching posts found' : 'No posts published yet'}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            {activeSearch
              ? 'Try another keyword or clear your search filter.'
              : 'Be the first to share an article on BlogSphere.'}
          </p>
          {activeSearch ? (
            <button
              type="button"
              onClick={handleClearSearch}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Reset search
            </button>
          ) : (
            <Link
              to={isAuthenticated ? '/posts/new' : '/register'}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Create first post
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={(nextPage) => {
              setPage(nextPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </div>
  );
}

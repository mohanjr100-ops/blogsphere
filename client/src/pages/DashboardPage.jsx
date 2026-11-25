import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, ExternalLink, PenSquare, Trash2 } from 'lucide-react';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { createExcerpt, formatDate } from '../utils/formatDate';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyPosts = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/posts', {
        params: {
          author: user._id,
          page,
          limit: 8,
        },
      });
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load your posts.'));
    } finally {
      setLoading(false);
    }
  }, [user?._id, page]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const handleDelete = async (postId) => {
    try {
      setDeletingId(postId);
      setError('');
      await api.delete(`/posts/${postId}`);
      setConfirmDeleteId(null);

      // If deleting the last item on a page > 1, step back a page
      if (posts.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchMyPosts();
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete post.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Author Dashboard
          </span>
          <h1 className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            My Posts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{user?.name}</span> (
            {user?.email})
          </p>
        </div>

        <Link
          to="/posts/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <PenSquare className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onRetry={fetchMyPosts} />
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading your posts..." />
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            You haven&apos;t published any posts yet
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Write your first article and share your thoughts with readers.
          </p>
          <Link
            to="/posts/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <PenSquare className="h-4 w-4" />
            Create Your First Post
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Published {formatDate(post.createdAt)}</span>
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                      <span>· Edited {formatDate(post.updatedAt)}</span>
                    )}
                  </div>
                  <Link
                    to={`/posts/${post._id}`}
                    className="mt-1 block truncate font-serif text-lg font-bold text-slate-900 hover:text-indigo-600"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">
                    {createExcerpt(post.content, 120)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    to={`/posts/${post._id}`}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </Link>
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </Link>

                  {confirmDeleteId === post._id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={deletingId === post._id}
                        onClick={() => handleDelete(post._id)}
                        className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                      >
                        {deletingId === post._id ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === post._id}
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(post._id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

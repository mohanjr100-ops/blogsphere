import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit3, Trash2 } from 'lucide-react';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDate, getInitials } from '../utils/formatDate';
import CommentSection from '../components/CommentSection';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/posts/${id}`);
      setPost(data.post);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load this post.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError('');
      await api.delete(`/posts/${id}`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'Failed to delete post.'));
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading article..." fullScreen />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>
        <ErrorAlert message={error} onRetry={fetchPost} />
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = Boolean(user?._id && post.author?._id === user._id);
  const authorName = post.author?.name || 'Unknown Author';
  const wasEdited = post.updatedAt && post.updatedAt !== post.createdAt;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all posts
      </Link>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <header className="border-b border-slate-100 pb-6">
          <h1 className="font-serif text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {getInitials(authorName)}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{authorName}</p>
                <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Published {formatDate(post.createdAt)}
                  {wasEdited && <span>· Updated {formatDate(post.updatedAt)}</span>}
                </p>
              </div>
            </div>

            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </Link>

                {confirmingDelete ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDelete}
                      className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                    >
                      {deleting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => setConfirmingDelete(false)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {deleteError && (
            <div className="mt-4">
              <ErrorAlert message={deleteError} />
            </div>
          )}
        </header>

        <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-slate-800 sm:text-[17px] sm:leading-8">
          {post.content}
        </div>
      </article>

      <CommentSection postId={post._id} />
    </div>
  );
}

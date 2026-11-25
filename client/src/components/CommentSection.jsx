import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatRelativeTime, getInitials } from '../utils/formatDate';
import ErrorAlert from './ErrorAlert';
import LoadingSpinner from './LoadingSpinner';

export default function CommentSection({ postId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/posts/${postId}/comments`);
      setComments(data.comments || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load comments.'));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      setSubmitError('Please write a comment before posting.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');
      const { data } = await api.post(`/posts/${postId}/comments`, { text: trimmed });
      setComments((prev) => [data.comment, ...prev]);
      setText('');
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Could not post comment.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setDeletingId(commentId);
      setError('');
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((item) => item._id !== commentId));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete comment.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <div className="mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-900">
          Comments {!loading && <span className="text-slate-400">({comments.length})</span>}
        </h2>
      </div>

      {isAuthenticated ? (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <label htmlFor="comment-text" className="mb-2 block text-sm font-medium text-slate-700">
            Add a comment as <span className="font-semibold text-slate-900">{user?.name}</span>
          </label>
          <textarea
            id="comment-text"
            rows={3}
            maxLength={1000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts on this post..."
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          {submitError && (
            <div className="mt-3">
              <ErrorAlert message={submitError} />
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">{text.length}/1000</span>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-100/70 p-5 text-sm text-slate-600">
          Want to join the conversation?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Log in
          </Link>{' '}
          or{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            create an account
          </Link>{' '}
          to leave a comment.
        </div>
      )}

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onRetry={fetchComments} />
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading comments..." />
      ) : comments.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500">
          No comments yet. Be the first to share your perspective!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner = user?._id && comment.author?._id === user._id;
            const authorName = comment.author?.name || 'Unknown User';

            return (
              <div
                key={comment._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {getInitials(authorName)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{authorName}</p>
                      <p className="text-xs text-slate-500">
                        {formatRelativeTime(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      type="button"
                      disabled={deletingId === comment._id}
                      onClick={() => handleDelete(comment._id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                      title="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deletingId === comment._id ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {comment.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PostEditorPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const loadPost = async () => {
      try {
        setLoading(true);
        setLoadError('');
        const { data } = await api.get(`/posts/${id}`);
        const post = data.post;

        if (user?._id && post.author?._id !== user._id) {
          setLoadError('You do not have permission to edit someone else’s post.');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        setLoadError(getErrorMessage(err, 'Failed to load post for editing.'));
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, isEditMode, user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      setSubmitError('Title must be at least 3 characters long.');
      return;
    }

    if (content.trim().length < 10) {
      setSubmitError('Content must be at least 10 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');

      const payload = {
        title: title.trim(),
        content: content.trim(),
      };

      const { data } = isEditMode
        ? await api.put(`/posts/${id}`, payload)
        : await api.post('/posts', payload);

      navigate(`/posts/${data.post._id}`, { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Failed to save post.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading editor..." fullScreen />;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Posts
        </Link>
        <ErrorAlert message={loadError} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        to={isEditMode ? `/posts/${id}` : '/dashboard'}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {isEditMode ? 'Back to post' : 'Back to dashboard'}
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
          {isEditMode ? 'Edit Post' : 'Write a New Post'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isEditMode
            ? 'Refine your title or article content and save your updates.'
            : 'Share an insight, tutorial, or story with the BlogSphere community.'}
        </p>

        {submitError && (
          <div className="mt-5">
            <ErrorAlert message={submitError} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="post-title" className="text-sm font-medium text-slate-700">
                Title
              </label>
              <span className="text-xs text-slate-400">{title.length}/150</span>
            </div>
            <input
              id="post-title"
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a compelling title..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="post-content" className="text-sm font-medium text-slate-700">
                Content
              </label>
              <span className="text-xs text-slate-400">
                {content.trim() ? content.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <textarea
              id="post-content"
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article here..."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Link
              to={isEditMode ? `/posts/${id}` : '/dashboard'}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {submitting
                ? 'Saving...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { createExcerpt, formatDate, getInitials } from '../utils/formatDate';

export default function PostCard({ post }) {
  const authorName = post.author?.name || 'Unknown Author';

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
              {getInitials(authorName)}
            </span>
            <span className="text-sm font-medium text-slate-700">{authorName}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.createdAt)}
          </span>
        </div>

        <Link to={`/posts/${post._id}`} className="block">
          <h2 className="font-serif text-xl font-bold leading-snug text-slate-900 transition group-hover:text-indigo-600">
            {post.title}
          </h2>
        </Link>

        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
          {createExcerpt(post.content, 155)}
        </p>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <Link
          to={`/posts/${post._id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition group-hover:gap-2 group-hover:text-indigo-700"
        >
          Read article
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from '@/lib/utils';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string;
    view_count: number;
    meta_description: string | null;
    profiles: {
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
    categories: {
      name: string;
      slug: string;
    } | null;
    article_tags: {
      tags: {
        name: string;
        slug: string;
      };
    }[];
  };
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const formattedDate = formatDistanceToNow(new Date(article.published_at));
  const authorName = article.profiles?.full_name || article.profiles?.username || 'Anonymous';
  const categoryName = article.categories?.name;
  const tags = article.article_tags?.map((at) => at.tags) || [];

  return (
    <article className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <Link href={`/article/${article.slug}`} className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {article.featured_image ? (
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <span className="text-4xl">📝</span>
          </div>
        )}
        
        {/* Category Badge */}
        {categoryName && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
              {categoryName}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/article/${article.slug}`} className="block group/title">
          <h2 className="text-xl font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors line-clamp-2 mb-2">
            {article.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {article.excerpt || article.meta_description || 'No description available.'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
         {/* <div className="flex items-center gap-2">
            {article.profiles?.avatar_url ? (
              <Image
                src={article.profiles.avatar_url}
                alt={authorName}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{authorName}</span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </div>
*/}
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{article.view_count.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
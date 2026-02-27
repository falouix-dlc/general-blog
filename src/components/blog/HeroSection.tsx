import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from '@/lib/utils';

interface HeroSectionProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string;
    view_count: number;
    profiles: {
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
    categories: {
      name: string;
      slug: string;
    } | null;
  };
}

export function HeroSection({ article }: HeroSectionProps) {
  const authorName = article.profiles?.full_name || article.profiles?.username || 'Anonymous';
  const formattedDate = formatDistanceToNow(new Date(article.published_at));

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {article.featured_image ? (
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Category Badge */}
          {article.categories && (
            <Link
              href={`/?category=${article.categories.slug}`}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600/90 backdrop-blur-sm text-white mb-6 hover:bg-blue-500 transition-colors"
            >
              {article.categories.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <Link href={`/article/${article.slug}`} className="hover:text-blue-200 transition-colors">
              {article.title}
            </Link>
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 line-clamp-3">
            {article.excerpt || 'Read the full article to learn more...'}
          </p>

          {/* Author & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-3">
              {article.profiles?.avatar_url ? (
                <Image
                  src={article.profiles.avatar_url}
                  alt={authorName}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-lg font-bold border-2 border-white/20">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-white">{authorName}</p>
                <p className="text-sm text-gray-400">{formattedDate} • {article.view_count.toLocaleString()} views</p>
              </div>
            </div>

            <Link
              href={`/article/${article.slug}`}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-100 transition-colors sm:ml-auto"
            >
              Read Article
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
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

        </div>
      </div>
    </section>
  );
}
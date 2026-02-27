import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from '@/lib/utils';

interface RelatedArticlesProps {
  articles: any[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <section className="bg-gray-50 border-t">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article key={article.id} className="group">
              <Link href={`/article/${article.slug}`} className="block">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-200 mb-4">
                  {article.featured_image ? (
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-gray-100 to-gray-200">
                      📝
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(article.published_at))}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
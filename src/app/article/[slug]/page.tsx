import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { RelatedArticles } from '@/components/blog/RelatedArticles';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { ViewCounter } from '@/components/blog/ViewCounter';
import { Comments } from '@/components/blog/Comments';
import { Navbar } from '@/components/blog/Navbar';

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: article } = await supabase
    .from('articles')
    .select('title, meta_title, meta_description, meta_keywords, featured_image, excerpt, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt || 'Read this article on General Blog';
  const image = article.featured_image || '/default-og.jpg';

  return {
    title,
    description,
    keywords: article.meta_keywords?.split(',').map(k => k.trim()) || [],
    authors: [{ name: 'General Blog' }],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.published_at,
      url: `/article/${slug}`,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `/article/${slug}`,
    },
  };
}

// Increment view count
async function incrementViewCount(articleId: string) {
  const supabase = await createClient();
  
  await supabase.rpc('increment_article_views', { article_id: articleId });
}

// Fetch article with all details
async function getArticle(slug: string) {
  const supabase = await createClient();
  
  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      content,
      excerpt,
      featured_image,
      published_at,
      updated_at,
      view_count,
      meta_title,
      meta_description,
      profiles(id, username, full_name, avatar_url),
      categories(id, name, slug),
      article_tags(tags(id, name, slug))
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !article) {
    return null;
  }

  return article;
}

// Fetch related articles
async function getRelatedArticles(categoryId: string | null, currentArticleId: string, limit: number = 3) {
  if (!categoryId) return [];
  
  const supabase = await createClient();
  
  const { data: articles } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      profiles(username, full_name)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .neq('id', currentArticleId)
    .order('published_at', { ascending: false })
    .limit(limit);

  return articles || [];
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Increment views in background (don't await)
  incrementViewCount(article.id);

  const author = article.profiles;
  const category = article.categories;
  const tags = article.article_tags?.map((at: any) => at.tags) || [];
  const relatedArticles = await getRelatedArticles(category?.id, article.id);

  return (
    <>
      <Navbar />
    <article className="min-h-screen bg-white">
      {/* Article Header */}
      <header className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Category */}
          {category && (
            <Link
              href={`/?category=${category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-6 hover:bg-blue-200 transition-colors"
            >
              {category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-3">
              {author?.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.full_name || 'Author'}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {(author?.full_name || author?.username || 'A').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {author?.full_name || author?.username || 'Anonymous'}
                </p>
                <p className="text-sm">
                  {formatDate(article.published_at)} · <ViewCounter articleId={article.id} initialCount={article.view_count} />
                </p>
              </div>
            </div>

            <ShareButtons title={article.title} slug={slug} />
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ArticleContent content={article.content} />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <Link
                  key={tag.id}
                  href={`/?tag=${tag.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {author && (
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-start gap-4">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.full_name || 'Author'}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
                  {(author.full_name || author.username || 'A').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-900">
                  Written by {author.full_name || author.username}
                </h3>
                <p className="text-gray-600 mt-1">
                  Author at General Blog. Sharing knowledge and insights about {category?.name || 'various topics'}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <RelatedArticles articles={relatedArticles} />
      )}
      <Comments articleId={article.id} />
    </article>
  </>
  );
}
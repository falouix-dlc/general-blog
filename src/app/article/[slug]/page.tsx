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
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

// Metadata generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: article } = await supabase
    .from('articles')
    .select('title, meta_title, meta_description, meta_keywords, featured_image, excerpt, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) {
    return { title: 'Article Not Found' };
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
    alternates: { canonical: `/article/${slug}` },
  };
}

// Increment view count
async function incrementViewCount(articleId: string) {
  const supabase = await createClient();
  await supabase.rpc('increment_article_views', { article_id: articleId });
}

// Fetch article
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

  if (error || !article) return null;
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
  if (!article) notFound();

  incrementViewCount(article.id);

  const author = article.profiles;
  const category = article.categories;
  const tags = article.article_tags?.map((at: any) => at.tags) || [];
  const relatedArticles = await getRelatedArticles(category?.id, article.id);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative bg-muted/30 border-b">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to articles
            </Link>

            {category && (
              <Link
                href={`/?category=${category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-6"
              >
                {category.name}
              </Link>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8 text-foreground">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {author?.avatar_url ? (
                  <Image
                    src={author.avatar_url}
                    alt={author.full_name || 'Author'}
                    width={56}
                    height={56}
                    className="rounded-full object-cover ring-2 ring-background shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-sm">
                    {(author?.full_name || author?.username || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {author?.full_name || author?.username || 'Anonymous'}
                  </span>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <ViewCounter articleId={article.id} initialCount={article.view_count} />
                    </span>
                  </div>
                </div>
              </div>

              <ShareButtons title={article.title} slug={slug} />
            </div>
          </div>
        </div>

        {article.featured_image && (
          <div className="relative w-full aspect-[21/9] md:aspect-[3/1] max-h-[600px] overflow-hidden">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
        )}

        <div className="max-w-2xl mx-auto px-6 py-16">
          {article.excerpt && (
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-light">
              {article.excerpt}
            </p>
          )}

          <ArticleContent content={article.content} />

          {tags.length > 0 && (
            <div className="mt-16 pt-8 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: any) => (
                  <Link
                    key={tag.id}
                    href={`/?tag=${tag.slug}`}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {author && (
            <div className="mt-16 p-8 rounded-2xl bg-muted/50 border border-border/50">
              <div className="flex items-start gap-5">
                {author.avatar_url ? (
                  <Image
                    src={author.avatar_url}
                    alt={author.full_name || 'Author'}
                    width={72}
                    height={72}
                    className="rounded-full object-cover ring-2 ring-background"
                  />
                ) : (
                  <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-2xl">
                    {(author.full_name || author.username || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">
                    Written by {author.full_name || author.username}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Author at General Blog sharing insights about {category?.name || 'technology, design, and development'}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {relatedArticles.length > 0 && (
          <div className="border-t bg-muted/30 py-16">
            <div className="max-w-6xl mx-auto px-6">
              <RelatedArticles articles={relatedArticles} />
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto px-6 py-16">
          <Comments articleId={article.id} />
        </div>
      </main>
    </>
  );
}
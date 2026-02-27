import { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { SearchBar } from '@/components/blog/SearchBar';
import { Pagination } from '@/components/blog/Pagination';
import { HeroSection } from '@/components/blog/HeroSection';
import { revalidatePath } from 'next/cache';

// SEO Metadata for Home Page
export const metadata: Metadata = {
  title: 'General Blog - Latest Articles & Insights',
  description: 'Discover the latest articles on technology, lifestyle, and tutorials. Stay informed with our curated content.',
  keywords: ['blog', 'technology', 'lifestyle', 'tutorials', 'articles'],
  authors: [{ name: 'General Blog' }],
  openGraph: {
    title: 'General Blog - Latest Articles & Insights',
    description: 'Discover the latest articles on technology, lifestyle, and tutorials.',
    type: 'website',
    locale: 'en_US',
    siteName: 'General Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'General Blog - Latest Articles & Insights',
    description: 'Discover the latest articles on technology, lifestyle, and tutorials.',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Types
interface Article {
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
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
}

// Fetch articles with pagination, filtering, and search
async function getArticles(
  page: number = 1,
  categorySlug?: string,
  searchQuery?: string
): Promise<{ articles: Article[]; totalCount: number; totalPages: number }> {
  const supabase = await createClient();
  const limit = 9;
  const offset = (page - 1) * limit;

  // Build base query
  let query = supabase
    .from('articles')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      view_count,
      meta_description,
      profiles(username, full_name, avatar_url),
      categories(name, slug),
      article_tags(tags(name, slug))
    `,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Apply category filter
  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (category && 'id' in category) {
      query = query.eq('category_id', (category as { id: string }).id);
    }
  }

  // Apply search filter
  if (searchQuery) {
    query = query.or(
      `title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
    );
  }

  // Apply pagination
  const { data: articles, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], totalCount: 0, totalPages: 0 };
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return { articles: articles as Article[], totalCount, totalPages };
}

// Fetch all categories
async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as Category[];
}

// Fetch featured article (latest published)
async function getFeaturedArticle(): Promise<Article | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      view_count,
      meta_description,
      profiles(username, full_name, avatar_url),
      categories(name, slug),
      article_tags(tags(name, slug))
    `
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as Article;
}

// Home Page Component
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const categorySlug = params.category;
  const searchQuery = params.search;

  // Fetch data in parallel
  const [{ articles, totalCount, totalPages }, categories, featuredArticle] = await Promise.all([
    getArticles(currentPage, categorySlug, searchQuery),
    getCategories(),
    getFeaturedArticle(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Article */}
      {featuredArticle && !categorySlug && !searchQuery && currentPage === 1 && (
        <HeroSection article={featuredArticle} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Latest Articles'}
          </h1>
          <p className="text-lg text-gray-600">
            {searchQuery
              ? `Found ${totalCount} article${totalCount !== 1 ? 's' : ''}`
              : 'Discover stories, thinking, and expertise from writers on any topic.'}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar initialValue={searchQuery} />
          </div>
          <CategoryFilter categories={categories} activeCategory={categorySlug} />
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article, index) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  priority={index < 3} // Priority loading for first 3 images
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                baseUrl="/"
                category={categorySlug}
                search={searchQuery}
              />
            )}
          </>
        ) : (
          <EmptyState searchQuery={searchQuery} categorySlug={categorySlug} />
        )}
      </div>
    </main>
  );
}

// Empty State Component
function EmptyState({ searchQuery, categorySlug }: { searchQuery?: string; categorySlug?: string }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
      <p className="text-gray-500">
        {searchQuery
          ? `No articles match your search "${searchQuery}". Try different keywords.`
          : categorySlug
          ? "No articles in this category yet. Check back later!"
          : "No articles published yet. Check back soon!"}
      </p>
    </div>
  );
}
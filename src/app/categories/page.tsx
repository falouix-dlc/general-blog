import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/blog/Navbar';
import { ArrowLeft, FolderOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse articles by category.',
};

async function getCategoriesWithCount() {
  const supabase = await createClient();
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      articles!inner(count)
    `)
    .eq('articles.status', 'published');

  if (error) return [];
  
  return categories?.map(cat => ({
    ...cat,
    article_count: cat.articles?.[0]?.count || 0
  })) || [];
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Categories</h1>
            <p className="text-lg text-muted-foreground">
              Browse all topics covered on this blog.
            </p>
          </header>

          {categories.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No categories yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.slug}`}
                  className="group p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {category.article_count} {category.article_count === 1 ? 'article' : 'articles'}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
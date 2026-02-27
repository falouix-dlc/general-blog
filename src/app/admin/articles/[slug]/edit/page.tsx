import { createClient } from '@/lib/supabase/server';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { redirect, notFound } from 'next/navigation';

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get article with tags
  const { data: article } = await supabase
    .from('articles')
    .select('*, article_tags(tag_id)')
    .eq('slug', slug)
    .single();

  if (!article) {
    notFound();
  }

  // Get categories and tags
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  const { data: tags } = await supabase
    .from('tags')
    .select('id, name')
    .order('name');

  async function updateArticle(formData: FormData) {
    'use server';

    const supabase = await createClient();

    const title = formData.get('title') as string;
    const newSlug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const categoryId = formData.get('category_id') as string;
    const status = formData.get('status') as 'draft' | 'published';
    const featuredImage = formData.get('featured_image') as string;
    const metaTitle = formData.get('meta_title') as string;
    const metaDescription = formData.get('meta_description') as string;
    const metaKeywords = formData.get('meta_keywords') as string;
    const tagIds = formData.getAll('tags') as string[];

    // Update article
    const { error } = await supabase
      .from('articles')
      .update({
        title,
        slug: newSlug,
        content,
        excerpt: excerpt || content.slice(0, 200) + '...',
        category_id: categoryId || null,
        status,
        featured_image: featuredImage || null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt || content.slice(0, 160),
        meta_keywords: metaKeywords || '',
        published_at: status === 'published' && !article.published_at 
          ? new Date().toISOString() 
          : article.published_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', article.id);

    if (error) {
      console.error('Error updating article:', error);
      throw new Error('Failed to update article');
    }

    // Update tags - delete old, insert new
    await supabase.from('article_tags').delete().eq('article_id', article.id);
    
    if (tagIds.length > 0) {
      const tagInserts = tagIds.map(tagId => ({
        article_id: article.id,
        tag_id: tagId,
      }));
      await supabase.from('article_tags').insert(tagInserts);
    }

    redirect('/admin/articles');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Article</h1>
      <ArticleForm 
        categories={categories || []} 
        tags={tags || []} 
        action={updateArticle}
        initialData={article}
      />
    </div>
  );
}
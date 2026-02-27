import { createClient } from '@/lib/supabase/server';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { redirect } from 'next/navigation';

export default async function NewArticlePage() {
  const supabase = await createClient();

  // Get categories for dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  // Get tags for selection
  const { data: tags } = await supabase
    .from('tags')
    .select('id, name')
    .order('name');

  async function createArticle(formData: FormData) {
    'use server';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const categoryId = formData.get('category_id') as string;
    const status = formData.get('status') as 'draft' | 'published';
    const featuredImage = formData.get('featured_image') as string;
    const metaTitle = formData.get('meta_title') as string;
    const metaDescription = formData.get('meta_description') as string;
    const metaKeywords = formData.get('meta_keywords') as string;
    const tagIds = formData.getAll('tags') as string[];

    // Create article
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title,
        slug,
        content,
        excerpt: excerpt || content.slice(0, 200) + '...',
        category_id: categoryId || null,
        author_id: user.id,
        status,
        featured_image: featuredImage || null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt || content.slice(0, 160),
        meta_keywords: metaKeywords || '',
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      throw new Error('Failed to create article');
    }

    // Add tags
    if (tagIds.length > 0 && article) {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Article</h1>
      <ArticleForm 
        categories={categories || []} 
        tags={tags || []} 
        action={createArticle} 
      />
    </div>
  );
}
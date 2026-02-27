import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const articleUrls = (articles || []).map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: article.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...articleUrls,
  ];
}
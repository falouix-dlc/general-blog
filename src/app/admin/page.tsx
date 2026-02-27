import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get stats
  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const { count: publishedArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const { count: draftArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');

  const { count: totalViews } = await supabase
    .from('articles')
    .select('view_count');

  const viewsSum = totalViews?.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0;

  // Get recent articles
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('id, title, slug, status, view_count, published_at, categories(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { label: 'Total Articles', value: totalArticles || 0, color: 'bg-blue-500' },
    { label: 'Published', value: publishedArticles || 0, color: 'bg-green-500' },
    { label: 'Drafts', value: draftArticles || 0, color: 'bg-yellow-500' },
    { label: 'Total Views', value: viewsSum.toLocaleString(), color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4`}>
              {stat.label === 'Total Articles' && '📝'}
              {stat.label === 'Published' && '✅'}
              {stat.label === 'Drafts' && '📄'}
              {stat.label === 'Total Views' && '👁️'}
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Articles</h2>
          <Link
            href="/admin/articles"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentArticles?.map((article) => (
            <div key={article.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <h3 className="font-medium text-gray-900">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {article.categories?.name} • {article.view_count} views
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  article.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {article.status}
                </span>
                <Link
                  href={`/admin/articles/${article.slug}/edit`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/articles/new"
          className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2">➕ Create New Article</h3>
          <p className="text-blue-100">Write and publish a new blog post</p>
        </Link>
        <Link
          href="/"
          className="bg-white text-gray-900 rounded-xl p-6 hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-2">🌐 View Website</h3>
          <p className="text-gray-500">See your blog as visitors see it</p>
        </Link>
      </div>
    </div>
  );
}
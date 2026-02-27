import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DeleteArticleButton } from '@/components/admin/DeleteArticleButton';

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const statusFilter = params.status;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const supabase = await createClient();

  // Build query
  let query = supabase
    .from('articles')
    .select('*, categories(name)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: articles, count } = await query.range(offset, offset + limit - 1);
  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Link
          href="/admin/articles"
          className={`px-4 py-2 rounded-lg ${
            !statusFilter ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/articles?status=published"
          className={`px-4 py-2 rounded-lg ${
            statusFilter === 'published' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Published
        </Link>
        <Link
          href="/admin/articles?status=draft"
          className={`px-4 py-2 rounded-lg ${
            statusFilter === 'draft' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Drafts
        </Link>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Article</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Views</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles?.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{article.title}</p>
                    <p className="text-sm text-gray-500">/{article.slug}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {article.categories?.name || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    article.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {article.view_count.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/article/${article.slug}`}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/articles/${article.slug}/edit`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </Link>
                  <DeleteArticleButton slug={article.slug} title={article.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/admin/articles?page=${page}${statusFilter ? `&status=${statusFilter}` : ''}`}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
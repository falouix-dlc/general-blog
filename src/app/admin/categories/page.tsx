import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + New Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Slug</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories?.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">/{category.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{category.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
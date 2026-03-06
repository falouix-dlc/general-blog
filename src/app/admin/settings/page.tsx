import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export default async function SettingsPage() {
  const supabase = await createClient();

  // Get site stats
  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  async function clearCache() {
    'use server';
    revalidatePath('/');
    revalidatePath('/admin');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Articles</span>
              <span className="font-medium text-gray-900">{totalArticles || 0}</span>
            </div>
          </div>
        </div>

        {/* Cache Management */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cache</h2>
          <form action={clearCache}>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Cache
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-2">
            Clears Next.js cache and refreshes all pages
          </p>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
          <p className="text-gray-600">
            General Blog v1.0 - Built with Next.js 16 and Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
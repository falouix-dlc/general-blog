import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900">General Blog</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
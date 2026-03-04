import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { MobileMenu } from './MobileMenu';

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-text-inverse font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-text hidden sm:block">General Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Auth */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/admin"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-text-inverse font-medium hover:opacity-90 transition-opacity"
                  >
                    Dashboard
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="text-text-muted hover:text-text font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-text-muted hover:text-text font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <MobileMenu user={user} />
          </div>
        </div>
      </nav>
    </header>
  );
}

// Extracted NavLink component for consistency
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-text-muted hover:text-text font-medium transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
    </Link>
  );
}
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AdminSidebarProps {
  user: {
    email?: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/articles', label: 'Articles', icon: '📝' },
    { href: '/admin/articles/new', label: 'New Article', icon: '➕' },
    { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            G
          </div>
          <span className="font-bold text-lg">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="mb-4 px-4 py-2 text-sm text-gray-400">
          {user.email}
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
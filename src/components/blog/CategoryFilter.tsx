'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
      <Link
        href="/"
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          !activeCategory
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        All
      </Link>
      
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/?category=${category.slug}`}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === category.slug
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
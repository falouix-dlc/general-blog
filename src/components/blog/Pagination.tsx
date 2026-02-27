'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  baseUrl: string;
  category?: string;
  search?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  baseUrl,
  category,
  search,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-8">
      <p className="text-sm text-gray-600">
        Showing <span className="font-medium">{(currentPage - 1) * 9 + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentPage * 9, totalCount)}</span> of{' '}
        <span className="font-medium">{totalCount}</span> articles
      </p>

      <nav className="flex items-center gap-1">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Link>
        ) : (
          <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </span>
        )}

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <Link
                  href={buildUrl(page as number)}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </Link>
              )}
            </span>
          ))}
        </div>

        {/* Mobile Current Page Indicator */}
        <span className="sm:hidden px-4 py-2 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Next
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">
            Next
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </nav>
    </div>
  );
}
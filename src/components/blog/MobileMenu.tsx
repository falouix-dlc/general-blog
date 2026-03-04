'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  user: unknown;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop - below navbar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu Container */}
      <div className="md:hidden relative z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-muted transition-colors"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <XIcon /> : <MenuIcon />}
        </button>

        {/* Dropdown Menu */}
        <div 
          className={`absolute top-full right-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg transform transition-all duration-200 ease-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <nav className="p-2 space-y-1">
            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/categories" onClick={() => setIsOpen(false)}>Categories</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
            
            <div className="pt-2 mt-2 border-t border-border">
              {user ? (
                <div className="space-y-1">
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-md bg-primary text-text-inverse font-medium hover:opacity-90 transition-opacity"
                  >
                    Dashboard
                  </Link>
                  <form action="/auth/signout" method="post" className="w-full">
                    <button
                      type="submit"
                      className="block w-full text-center px-4 py-2 rounded-md text-text-muted hover:text-text hover:bg-muted font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-md bg-muted text-text font-medium hover:bg-primary hover:text-text-inverse transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 rounded-md text-text-muted hover:text-text hover:bg-muted font-medium transition-colors"
    >
      {children}
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
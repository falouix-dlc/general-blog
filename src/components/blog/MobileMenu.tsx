'use client';

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface MobileMenuProps {
  user: unknown;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    if (open) {
      document.addEventListener("keydown", esc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="md:hidden relative z-[10000] p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-5 h-[2px] bg-current transition-all duration-300 ${
              open ? "rotate-45 translate-y-[5px]" : "-translate-y-1"
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-current my-[3px] transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-current transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-[5px]" : "translate-y-1"
            }`}
          />
        </div>
      </button>

      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
              open
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background */}
            <div
              onClick={closeMenu}
              className="absolute inset-0 bg-slate-50/95 backdrop-blur-xl"
            />

            {/* Menu */}
            <div
              className={`relative flex flex-col h-full pt-28 px-8 pb-10 transition-all duration-500 ${
                open
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-10 opacity-0"
              }`}
            >
              {/* X Close Button */}
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="absolute top-6 right-6 p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Navigation */}
              <nav className="flex flex-col gap-10 text-5xl font-bold text-slate-900">
                <MenuLink href="/" index={0} open={open} close={closeMenu}>
                  Home
                </MenuLink>

                <MenuLink
                  href="/categories"
                  index={1}
                  open={open}
                  close={closeMenu}
                >
                  Categories
                </MenuLink>

                <MenuLink href="/about" index={2} open={open} close={closeMenu}>
                  About
                </MenuLink>
              </nav>

              {/* Bottom Section */}
              <div className="mt-auto pt-10 border-t border-slate-200">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="block text-center py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                      Dashboard
                    </Link>

                    <form action="/auth/signout" method="post">
                      <button className="w-full py-3 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 transition">
                        Sign Out
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="block text-center py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function MenuLink({
  href,
  children,
  open,
  index,
  close,
}: {
  href: string;
  children: React.ReactNode;
  open: boolean;
  index: number;
  close: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={close}
      className={`transition-all duration-500 hover:text-blue-600 hover:translate-x-2 ${
        open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {children}
    </Link>
  );
}
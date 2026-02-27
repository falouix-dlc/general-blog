"use client";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";

export default function AdminSidebarClient({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar user={user} closeSidebar={() => setIsOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden mb-4 px-3 py-2 bg-gray-100 rounded absolute top-4 left-4 z-50"
      >
        ☰ Menu
      </button>
    </>
  );
}
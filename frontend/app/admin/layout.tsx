"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-[auto_1fr] bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-64 bg-white shadow-xl">
            <AdminSidebar closeSidebar={() => setIsOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Section */}
      <div className="h-screen overflow-y-auto">
        <AdminNavbar openSidebar={() => setIsOpen(true)} />

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

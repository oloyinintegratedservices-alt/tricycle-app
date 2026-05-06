"use client";
import { Bell, UserStar } from "lucide-react";

export default function AdminNavbar({
  openSidebar,
}: {
  openSidebar: () => void;
}) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 static">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button onClick={openSidebar} className="md:hidden text-xl">
          ☰
        </button>

        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block border rounded-lg px-3 py-1 text-gray-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <Bell />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <UserStar />
          </div>
          {/* <span className="hidden md:block text-sm font-medium">Admin</span> */}
        </div>
      </div>
    </header>
  );
}

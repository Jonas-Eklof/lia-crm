import React from "react";
import { SearchIcon, BellIcon, MenuIcon } from "lucide-react";
export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between md:justify-end">
        <div className="hamburger-menu flex items-center md:hidden">
          <button className="text-gray-600 hover:text-blue-600">
            <MenuIcon size={24} />
          </button>
        </div>

        <div className="profile-name flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
              JE
            </div>
            <span className="hidden md:inline text-sm font-medium">
              Jonas Eklöf
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

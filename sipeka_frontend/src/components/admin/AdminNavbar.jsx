import { useEffect } from "react";
import { initDropdowns } from "flowbite";
import { LogOut } from "lucide-react";

export default function AdminNavbar({ admin, setIsSidebarOpen, handleLogout, isSubmitted }) {
  useEffect(() => {
    initDropdowns();
  }, []);

  return (
    <div className="bg-[#204c3f] text-white flex justify-between items-center px-6 h-16 shadow-md relative z-50">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsSidebarOpen(prev => !prev)} className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src="/src/assets/logo.png" alt="Logo" className="h-12 rounded-full" />
      </div>

      <div className="relative">
        <button
          id="dropdownAvatarNameButton"
          data-dropdown-toggle="dropdownAvatarName"
          className="flex items-center text-sm font-medium text-white hover:text-teal-200"
          type="button"
        >
          <img
            className="w-8 h-8 mr-2 rounded-full object-cover"
            src={admin.photo || `https://ui-avatars.com/api/?name=${admin.name}`}
            alt="user avatar"
          />
          {admin.name}
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.585l3.71-4.355a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div
          id="dropdownAvatarName"
          className="z-50 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <div className="px-4 py-3 text-sm text-gray-900">
            <div>{admin.name}</div>
          </div>
          <div className="py-1">
            <button
              onClick={handleLogout}
              type="button"
              disabled={isSubmitted}
              className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
            >
              <LogOut size={16} className="inline mr-1" />
              {isSubmitted ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { initDropdowns } from "flowbite";

export default function UserNavbar({ user }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  useEffect(() => {
    initDropdowns();
  }, [user]);


  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    setIsSubmitted(true);
    try {
      const res = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        console.error("Logout failed:", await res.json());
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsSubmitted(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `font-medium ${
      isActive ? "text-teal-600" : "text-gray-700 hover:text-teal-500"
    }`;

  return (
    <header className="bg-white shadow-md px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center ">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-teal-600"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <img src="/src/assets/logo.png" alt="Logo" className="h-12 rounded-full mr-5" />

          <nav className="hidden md:flex gap-4">
            <NavLink to="/user/home" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/user/complaints" className={navLinkClass}>
              Complaints
            </NavLink>
            <NavLink to="/user/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </nav>
        </div>

        {/* Right Side: Avatar + Hamburger */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* User Dropdown */}
            <div className="relative">
              <button
                id="dropdownAvatarNameButton"
                data-dropdown-toggle="dropdownAvatarName"
                className="flex items-center text-sm font-medium text-gray-900 hover:text-teal-600"
                type="button"
              >
                <img
                  className="w-8 h-8 mr-2 rounded-full object-cover"
                  src={
                    user.photo ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  alt="user avatar"
                />
                {user.name}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
                  <div>{user.name}</div>
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
        ) : (
          <div className="flex items-center gap-4">
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={navLinkClass}>
              Register
            </NavLink>
          </div>
        )}
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-2 mt-2 mb-5">
          <NavLink
            to="/user/home"
            className={navLinkClass}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/user/complaints"
            className={navLinkClass}
            onClick={() => setIsMenuOpen(false)}
          >
            Complaints
          </NavLink>
          <NavLink
            to="/user/profile"
            className={navLinkClass}
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </NavLink>
        </div>
      )}
    </header>
  );
}

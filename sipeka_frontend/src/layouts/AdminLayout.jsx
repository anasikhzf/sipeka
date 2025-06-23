import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.role !== "admin") {
            navigate("/user/home");
            return;
          }
          setAdmin(data);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        console.error("Gagal mengambil data admin", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    setIsSubmitted(true);
    const token = localStorage.getItem("token");
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
        console.error("Logout gagal:", await res.json());
      }
    } catch (err) {
      console.error("Terjadi error saat logout:", err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-[#eaeaea] min-h-screen flex flex-col">
      {/* Navbar tetap di atas */}
      <AdminNavbar
        admin={admin}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        isSubmitted={isSubmitted}
      />

      {/* Overlay sidebar untuk mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Area utama layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onLinkClick={() => setIsSidebarOpen(false)}
        />

        {/* Konten yang scroll horizontal jika terlalu lebar */}
        <div
          className={`
          flex-1 overflow-x-auto p-6 h-[calc(100vh-4rem)]  // 4rem = tinggi navbar (h-16)
          transition-all duration-300
          ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}
        `}
        >
          <main className="w-full max-w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}

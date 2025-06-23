import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data admin login
    const fetchAdmin = async () => {
      try {
        const response = await api.get("/user");
        if (response.data.role !== "admin") {
          navigate("/unauthorized"); // jika bukan admin
        } else {
          setAdmin(response.data);
        }
      } catch (err) {
        navigate("/login");
      }
    };

    fetchAdmin();
  }, [navigate]);

  if (!admin) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white h-screen shadow-md">
          <div className="p-4 text-lg font-bold border-b">Admin Panel</div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="/admin/categories" className="block p-2 hover:bg-gray-100 rounded">Kelola Kategori</a>
              </li>
              <li>
                <a href="/admin/complaints" className="block p-2 hover:bg-gray-100 rounded">Kelola Pengaduan</a>
              </li>
              <li>
                <a href="/admin/users" className="block p-2 hover:bg-gray-100 rounded">Kelola Pengguna</a>
              </li>
              <li>
                <a href="/admin/ratings" className="block p-2 hover:bg-gray-100 rounded">Kelola Rating</a>
              </li>
              <li>
                <a href="/admin/responses" className="block p-2 hover:bg-gray-100 rounded">Kelola Tanggapan</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Selamat Datang, {admin.name}</h1>
          <p className="text-gray-700">Ini adalah dashboard admin. Gunakan sidebar untuk mengelola data.</p>
        </main>
      </div>
    </div>
  );
}

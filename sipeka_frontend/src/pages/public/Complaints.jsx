import { useEffect, useState } from "react";
import api from "../../api/api";
import { createAttachment } from "../../_services/attachment";
import { useNavigate } from "react-router-dom";

const initialForm = {
  title: "",
  description: "",
  location: "",
  category_id: "",
};

export default function ComplaintForm() {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cek token saat pertama kali halaman dibuka
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch kategori ketika komponen mount
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        ...form,
        user_id: user.user_id,
      };

      // 1. Submit complaint
      const res = await api.post("/complaints", payload);
      const complaintId = res.data.complaint_id;

      // 2. Jika ada file, submit attachment
      if (file) {
        const attachmentForm = new FormData();
        attachmentForm.append("file", file);
        attachmentForm.append("complaint_id", complaintId);
        await createAttachment(attachmentForm);
      }

      alert("Complaint berhasil dibuat!");
      setForm(initialForm);
      setFile(null);
    } catch (err) {
      console.error("Gagal submit:", err);
      alert("Terjadi kesalahan saat membuat complaint");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buat Pengaduan</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-100 p-4 rounded"
      >
        <div>
          <label>Judul:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2"
            required
          />
        </div>
        <div>
          <label>Deskripsi:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2"
            required
          ></textarea>
        </div>
        <div>
          <label>Lokasi:</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border px-3 py-2"
            required
          />
        </div>
        <div>
          <label>Kategori:</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border px-3 py-2"
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Bukti Foto:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".jpg,.jpeg,.png,.pdf,.mp4"
            className="w-full border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#204c3f] text-white px-4 py-2 rounded hover:bg-green-800"
        >
          {loading ? "Menyimpan..." : "Kirim Pengaduan"}
        </button>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const initialForm = {
  title: '',
  description: '',
  location: '',
  category_id: '',
  status: 'diproses'
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentId, setCurrentId] = useState(null);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Gagal fetch complaints:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Gagal fetch kategori:', err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchCategories();
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/complaints/${currentId}`, form);
      } else {
        const user = JSON.parse(localStorage.getItem('user')); // asumsikan user info disimpan di localStorage
        const payload = {
          ...form,
          user_id: user.user_id, // user yang sedang login
        };
        await api.post('/complaints', payload);
      }
      setForm(initialForm);
      setShowForm(false);
      setIsEditing(false);
      setCurrentId(null);
      fetchComplaints();
    } catch (error) {
      console.error('Gagal simpan complaint:', error);
    }
  };

  const handleEdit = (complaint) => {
    setForm({
      title: complaint.title,
      description: complaint.description,
      location: complaint.location,
      category_id: complaint.category?.category_id || '',
      status: complaint.status,
    });
    setCurrentId(complaint.complaint_id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus complaint ini?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (error) {
      console.error('Gagal hapus complaint:', error);
    }
  };

  const filteredComplaints = complaints.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Complaint Management</h1>
        <button
          onClick={() => {
            setForm(initialForm);
            setIsEditing(false);
            setShowForm(true);
          }}
          className="bg-[#204c3f] text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Tambah Complaint
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded space-y-3">
          <div>
            <label className="block">Judul:</label>
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
            <label className="block">Deskripsi:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block">Lokasi:</label>
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
            <label className="block">Kategori:</label>
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
  <label className="block">Status:</label>
  <select
    name="status"
    value={form.status}
    onChange={handleChange}
    className="w-full border px-3 py-2"
    required
  >
    <option value="diproses">Diproses</option>
    <option value="ditolak">Ditolak</option>
    <option value="selesai">Selesai</option>
  </select>
</div>

          <div className="space-x-2">
            <button type="submit" className="bg-[#204c3f] text-white px-4 py-2 rounded hover:bg-green-800">
              {isEditing ? 'Update' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(initialForm);
                setIsEditing(false);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <input
        type="text"
        placeholder="Cari judul..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 mb-4 w-full md:w-1/3"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Judul</th>
                <th className="py-2 px-4 border">Deskripsi</th>
                <th className="py-2 px-4 border">Lokasi</th>
                <th className="py-2 px-4 border">Kategori</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">User</th>
                <th className="py-2 px-4 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Tidak ada data.</td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.complaint_id}>
                    <td className="py-2 px-4 border">{c.complaint_id}</td>
                    <td className="py-2 px-4 border">{c.title}</td>
                    <td className="py-2 px-4 border">{c.description}</td>
                    <td className="py-2 px-4 border">{c.location}</td>
                    <td className="py-2 px-4 border">{c.category?.name}</td>
                    <td className="py-2 px-4 border capitalize">{c.status}</td>
                    <td className="py-2 px-4 border">{c.user?.name}</td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.complaint_id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Complaints;

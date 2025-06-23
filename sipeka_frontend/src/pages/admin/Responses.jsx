import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const initialForm = {
  message: '',
  complaint_id: '',
};

const Responses = () => {
  const [responses, setResponses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- tambahkan state searchTerm

  const fetchResponses = async () => {
    try {
      const res = await api.get('/responses');
      setResponses(res.data);
    } catch (err) {
      console.error('Gagal fetch responses:', err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Gagal fetch complaints:', err);
    }
  };

  useEffect(() => {
    fetchResponses();
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/responses/${currentId}`, form);
      } else {
        await api.post('/responses', form);
      }
      setForm(initialForm);
      setIsEditing(false);
      setShowForm(false);
      setCurrentId(null);
      fetchResponses();
    } catch (err) {
      alert('Gagal menyimpan response.');
    }
  };

  const handleEdit = (res) => {
    setForm({
      message: res.message,
      complaint_id: res.complaint?.complaint_id || '',
    });
    setCurrentId(res.response_id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus response ini?')) return;
    try {
      await api.delete(`/responses/${id}`);
      fetchResponses();
    } catch (err) {
      alert('Gagal menghapus response.');
    }
  };

  // Filter responses berdasarkan message atau complaint title
  const filteredResponses = responses.filter((res) =>
    res.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (res.complaint?.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Response Management</h1>
        <button
          onClick={() => {
            setForm(initialForm);
            setIsEditing(false);
            setShowForm(true);
          }}
          className="bg-[#204c3f] text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Tambah Response
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded space-y-3">
          <div>
            <label className="block">Pesan:</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block">Pilih Complaint:</label>
            <select
              name="complaint_id"
              value={form.complaint_id}
              onChange={handleChange}
              className="w-full border px-3 py-2"
              required
            >
              <option value="">Pilih Complaint</option>
              {complaints.map((c) => (
                <option key={c.complaint_id} value={c.complaint_id}>
                  {c.title}
                </option>
              ))}
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

      {/* Search bar */}
      <input
        type="text"
        placeholder="Cari pesan atau complaint..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 mb-4 w-full md:w-1/3"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Complaint</th>
              <th className="py-2 px-4 border">Pesan</th>
              <th className="py-2 px-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredResponses.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">Tidak ada data.</td>
              </tr>
            ) : (
              filteredResponses.map((res) => (
                <tr key={res.response_id}>
                  <td className="py-2 px-4 border">{res.response_id}</td>
                  <td className="py-2 px-4 border">
                    {res.complaint?.title || 'Judul tidak ditemukan'}
                  </td>
                  <td className="py-2 px-4 border">{res.message}</td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      onClick={() => handleEdit(res)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(res.response_id)}
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
    </div>
  );
};

export default Responses;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileIcon from "../../assets/person.png";
import {
  getCurrentUser,
  getUserComplaints,
  submitUserRating,
} from "../../_services/userService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("diproses");
  const [expandedId, setExpandedId] = useState(null);
  const [formRatings, setFormRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("");
const [selectedDate, setSelectedDate] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const formatDateTime = (isoString) =>
    new Date(isoString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        const complaintList = await getUserComplaints();
        // Urutkan berdasarkan created_at DESC
        const sorted = complaintList.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setComplaints(sorted);
      } catch (err) {
        setError("Gagal memuat data pengguna atau keluhan.");
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleRatingChange = (id, field, value) => {
    setFormRatings((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const submitRating = async (complaintId) => {
    const ratingData = formRatings[complaintId];
    if (!ratingData?.rating || ratingData.rating < 1 || ratingData.rating > 5)
      return alert("Rating harus antara 1 sampai 5");

    try {
      const updated = await submitUserRating({
  complaint_id: complaintId,
  rating: ratingData.rating,
  feedback: ratingData.feedback,
});

      alert("Rating berhasil dikirim!");
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === complaintId ? { ...c, rating: updated } : c
        )
      );
    } catch (err) {
      alert("Gagal mengirim rating");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderComplaintCard = (c) => (
    <div
      key={c.complaint_id}
      className="bg-white rounded-md shadow-md p-4 mb-4"
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() =>
          setExpandedId(expandedId === c.complaint_id ? null : c.complaint_id)
        }
      >
        <div>
          <h4 className="font-semibold text-lg text-black">{c.title}</h4>
          <p className="text-sm text-gray-600">{c.location}</p>
          <p className="text-sm text-gray-500 italic">
            {formatDateTime(c.created_at)}
          </p>
        </div>
        <button
          className={`px-3 py-1 rounded text-sm font-medium ${
            expandedId === c.complaint_id
              ? "border border-[#204c3f] text-[#204c3f]"
              : "bg-[#204c3f] text-white"
          }`}
        >
          {expandedId === c.complaint_id ? "Sembunyikan" : "Detail"}
        </button>
      </div>

      {expandedId === c.complaint_id && (
        <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Deskripsi:</span> {c.description}
          </p>
          <p>
            <span className="font-semibold">Kategori:</span>{" "}
            {c.category?.name || "-"}
          </p>

          {Array.isArray(c.attachments) && c.attachments.length > 0 && (
            <div>
              <p className="font-semibold mt-2">Lampiran:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {c.attachments.map((a) => (
                  <img
                    key={a.id}
                    src={`http://localhost:8000/${a.file_path}`}
                    alt="lampiran"
                    className="w-full max-h-64 object-contain border rounded p-2 bg-gray-50"
                    onError={(e) => (e.target.src = "/default-image.png")}
                  />
                ))}
              </div>
            </div>
          )}

          {c.response && (
            <div className="mt-4 border-t pt-4">
              <p className="font-semibold text-green-700">Tanggapan Admin:</p>
              <p>{c.response.message}</p>
              <p className="text-xs text-gray-500 italic">
                {formatDateTime(c.response.created_at)}
              </p>
            </div>
          )}

          {c.rating ? (
            <div className="mt-4 border-t pt-4">
              <p className="font-semibold text-yellow-600">Rating Anda:</p>
              <p className="text-yellow-400 text-3xl">
                {Array.from({ length: 5 }, (_, i) =>
                  i < c.rating.rating ? "★" : "☆"
                )}
              </p>
              <p>
                <span className="font-semibold">Feedback:</span>{" "}
                {c.rating.feedback || "-"}
              </p>
              <p className="text-xs text-gray-500 italic">
                {formatDateTime(c.rating.created_at)}
              </p>
            </div>
          ) : (
            (c.status === "selesai" || c.status === "ditolak") && (
              <div className="mt-4 border-t pt-4">
                <p className="font-semibold text-yellow-600 mb-2">
                  Beri Rating:
                </p>
                <div className="flex space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        handleRatingChange(c.complaint_id, "rating", num)
                      }
                      className={`text-2xl ${
                        formRatings[c.complaint_id]?.rating >= num
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Masukkan feedback (opsional)"
                  className="w-full border rounded px-3 py-2 text-sm mb-2"
                  value={formRatings[c.complaint_id]?.feedback || ""}
                  onChange={(e) =>
                    handleRatingChange(
                      c.complaint_id,
                      "feedback",
                      e.target.value
                    )
                  }
                />
                <button
                  onClick={() => submitRating(c.complaint_id)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Kirim Rating
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );

  const renderTab = (status) => {
  const filtered = complaints
    .filter((c) => c.status === status)
    .filter(
      (c) =>
        (!searchTerm ||
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!selectedCategory || c.category?.name === selectedCategory) &&
        (!selectedDate ||
          new Date(c.created_at).toDateString() ===
            new Date(selectedDate).toDateString())
    )
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 capitalize">Keluhan {status}</h3>
      {filtered.length > 0 ? (
        filtered.map(renderComplaintCard)
      ) : (
        <p className="text-sm text-gray-500">
          Tidak ada keluhan sesuai filter.
        </p>
      )}
    </div>
  );
};


  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!user) return <div className="p-6">Loading...</div>;

  return (
  <>
    {/* Header Profile */}
    <div className="bg-[#204c3f] h-[130px]">
      <div className="container mx-auto px-6 md:px-24">
        <div className="relative top-12 bg-white rounded shadow-md p-6 pb-0">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img
                src={ProfileIcon}
                alt="User"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{complaints.length}</p>
              <p className="text-sm text-gray-600">Complaints</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 mt-8 border-b pb-0">
            {["diproses", "ditolak", "selesai"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 ${
                  activeTab === tab
                    ? "font-semibold border-b-2 border-black text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Filter dan Konten */}
    <div className="container mx-auto px-6 md:px-24 mt-[100px]">
      {/* Filter Input */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari judul atau lokasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/4"
        >
          <option value="">Semua Kategori</option>
          {[...new Set(complaints.map((c) => c.category?.name))]
            .filter(Boolean)
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/4"
        />
      </div>

      {/* Daftar Keluhan */}
      {renderTab(activeTab)}
    </div>
  </>
);

}

import { useEffect, useState } from "react";
import { getComplaint } from "../../_services/complaint";
import {
  getAttachment,
  createAttachment,
  deleteAttachment,
  imageSTORAGE,
} from "../../_services/attachment";

export default function Attachments() {
  const [attachments, setAttachments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attachmentData, complaintData] = await Promise.all([
          getAttachment(),
          getComplaint(),
        ]);
        setAttachments(attachmentData);
        setComplaints(complaintData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (attachment_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attachment?"
    );
    if (confirmDelete) {
      try {
        await deleteAttachment(attachment_id);
        setAttachments(
          attachments.filter((a) => a.attachment_id !== attachment_id)
        );
      } catch (error) {
        console.error("Error deleting attachment:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedComplaint)
      return alert("File dan complaint harus dipilih");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("complaint_id", selectedComplaint);

    try {
      await createAttachment(formData);
      const updated = await getAttachment();
      setAttachments(updated);
      resetForm();
    } catch (error) {
      console.error("Error uploading attachment:", error);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedComplaint("");
    setShowForm(false);
  };

  const filteredAttachments = attachments.filter((att) =>
    att.complaint?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderFilePreview = (filePath) => {
    const fullUrl = `${imageSTORAGE}/${filePath}`;
    const extension = filePath.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png"].includes(extension)) {
      return (
        <img
          src={fullUrl}
          alt="attachment"
          className="w-16 h-16 object-cover rounded"
        />
      );
    }

    if (extension === "pdf") {
      return (
        <iframe
          src={fullUrl}
          title="PDF Preview"
          className="w-32 h-32 border rounded"
        ></iframe>
      );
    }

    if (extension === "mp4") {
      return (
        <video
          src={fullUrl}
          controls
          className="w-32 h-32 rounded object-cover"
        />
      );
    }

    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 underline"
      >
        Lihat File
      </a>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Attachment Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-[#204c3f] text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Tambah Attachment
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan nama complaint..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 w-full md:w-1/3"
        />
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-gray-100 p-4 rounded space-y-3"
        >
          <div>
            <label className="block mb-1 font-medium">Complaint:</label>
            <select
              value={selectedComplaint}
              onChange={(e) => setSelectedComplaint(e.target.value)}
              required
              className="w-full border px-3 py-2"
            >
              <option value="">Pilih Complaint</option>
              {complaints.map((c) => (
                <option key={c.complaint_id} value={c.complaint_id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">File:</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".jpg,.jpeg,.png,.pdf,.mp4"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <p className="text-sm text-gray-500">
              Max 20MB. JPG, PNG, PDF, MP4
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#204c3f] text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Nama Complaint</th>
              <th className="px-4 py-2 text-left">File</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttachments.map((att) => (
              <tr
                key={att.attachment_id}
                className="border-t hover:bg-gray-100"
              >
                <td className="px-4 py-2">{att.complaint?.title}</td>
                <td className="px-4 py-2">
                  {renderFilePreview(att.file_path)}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(att.attachment_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filteredAttachments.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

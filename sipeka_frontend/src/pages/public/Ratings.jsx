// import React, { useEffect, useState } from "react";
// import { getComplaint } from "../../_services/complaint";
// import { createRating } from "../../_services/rating";
// import { Star } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function Ratings() {
//   const [form, setForm] = useState({ rating: 0, feedback: "" });
//   const [complaints, setComplaints] = useState([]);
//   const [selectedComplaint, setSelectedComplaint] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();

//   // Cek token saat pertama kali halaman dibuka
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [complaintData] = await Promise.all([getComplaint()]);
//         setComplaints(complaintData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleStarClick = (ratingValue) => {
//     setForm({ ...form, rating: ratingValue });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!selectedComplaint) {
//       setError("Complaint harus dipilih");
//       setLoading(false);
//       return;
//     }

//     if (form.rating === 0) {
//       setError("Silakan pilih rating");
//       setLoading(false);
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("rating", form.rating);
//       formData.append("feedback", form.feedback);
//       formData.append("complaint_id", selectedComplaint);

//       await createRating(formData);

//       alert("Penilaian berhasil dikirim!");
//       setForm({ rating: 0, feedback: "" });
//       setSelectedComplaint("");
//     } catch (err) {
//       console.error("Error submitting rating:", err);
//       if (err.response && err.response.data && err.response.data.errors) {
//         // Laravel validation errors
//         const messages = Object.values(err.response.data.errors)
//           .flat()
//           .join(", ");
//         setError(messages);
//       } else {
//         setError("Terjadi kesalahan saat mengirim penilaian");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Beri Penilaian</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-4 bg-gray-100 p-4 rounded"
//       >
//         {error && <div className="text-red-500">{error}</div>}

//         {/* Complaint Selector */}
//         <div>
//           <label className="block mb-1 font-medium">Complaint:</label>
//           <select
//             value={selectedComplaint}
//             onChange={(e) => setSelectedComplaint(e.target.value)}
//             className="w-full border px-3 py-2"
//             required
//           >
//             <option value="">Pilih Complaint</option>
//             {complaints.map((c) => (
//               <option key={c.complaint_id} value={c.complaint_id}>
//                 {c.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Feedback */}
//         <div>
//           <label className="block mb-1 font-medium">Feedback:</label>
//           <textarea
//             name="feedback"
//             value={form.feedback}
//             onChange={(e) =>
//               setForm((prev) => ({ ...prev, feedback: e.target.value }))
//             }
//             className="w-full border px-3 py-2"
//             required
//           />
//         </div>

//         {/* Rating Stars */}
//         <div>
//           <label className="block mb-1 font-medium">Rating:</label>
//           <div className="flex space-x-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button
//                 key={star}
//                 type="button"
//                 onClick={() => handleStarClick(star)}
//                 className="focus:outline-none"
//               >
//                 <Star
//                   size={32}
//                   fill={form.rating >= star ? "#facc15" : "none"}
//                   stroke="#facc15"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-[#204c3f] text-white px-4 py-2 rounded hover:bg-green-800"
//         >
//           {loading ? "Menyimpan..." : "Kirim Penilaian"}
//         </button>
//       </form>
//     </div>
//   );
// }

// import React from "react";
// import { FileEdit } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="flex flex-col gap-1">
//       {/* Bagian atas */}
//       <section className="text-center py-10 px-4">
//         <h1 className="text-3xl md:text-4xl font-bold mb-4">
//           Fasilitas Kampus Lebih Baik Dimulai<br />Dari Laporan Anda
//         </h1>
//         <p className="text-gray-700 text-lg max-w-2xl mx-auto">
//           Laporkan setiap kerusakan atau masalah fasilitas dengan cepat.<br />
//           Kami akan segera menindaklanjuti agar kampus tetap nyaman dan mendukung kebutuhan belajar Anda.
//         </p>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-[#204c3f] text-white text-center py-10 px-4">
//         <h2 className="text-2xl font-bold mb-2">Mulai Melapor Sekarang</h2>
//         <p className="mb-6 text-base">Atasi masalah fasilitas kampus dengan mengirim laporan Anda.</p>
//         <button
//           onClick={() => navigate("/user/complaints")}
//           className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full flex items-center gap-2 mx-auto font-semibold"
//         >
//           <FileEdit size={18} /> FILE A COMPLAINT
//         </button>
//       </section>
//     </div>
//   );
// }

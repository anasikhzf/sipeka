import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { getComplaint } from "../../_services/complaint";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      const data = await getComplaint();
      setComplaints(data);
    };
    fetchData();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const date = new Date(c.created_at);
    return (
      date.getMonth() + 1 === selectedMonth &&
      date.getFullYear() === selectedYear
    );
  });

  const categoryLabels = [
    ...new Set(
      filteredComplaints
        .filter((c) => c.category && c.category.name)
        .map((c) => c.category.name)
    ),
  ];

  const categoryCounts = categoryLabels.map(
    (name) =>
      filteredComplaints.filter((c) => c.category && c.category.name === name)
        .length
  );

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["diproses", "ditolak", "selesai"].map((status) => {
          const count = complaints.filter((c) => c.status === status).length;
          return (
            <div key={status} className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold capitalize">{status}</h2>
              <p className="text-2xl text-teal-600 font-bold">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 items-left">
        <select
          className="border rounded px-3 py-1 min-w-[120px]"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-1 min-w-[80px]"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Kategori Terpopuler</h3>
          <div className="max-w-sm h-[250px] mx-auto">
            <Pie
              data={{
                labels: categoryLabels,
                datasets: [
                  {
                    data: categoryCounts,
                    backgroundColor: [
                      "#14b8a6",
                      "#f87171",
                      "#60a5fa",
                      "#facc15",
                      "#a78bfa",
                      "#34d399",
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Complaint per Bulan</h3>
          <div className="relative h-[250px]">
            <Line
              data={{
                labels: Array.from({ length: 12 }, (_, i) =>
                  new Date(0, i).toLocaleString("default", { month: "short" })
                ),
                datasets: [
                  {
                    label: "Jumlah Complaint",
                    data: Array.from(
                      { length: 12 },
                      (_, i) =>
                        complaints.filter((c) => {
                          const date = new Date(c.created_at);
                          return (
                            date.getMonth() === i &&
                            date.getFullYear() === selectedYear
                          );
                        }).length
                    ),
                    borderColor: "#14b8a6",
                    backgroundColor: "#14b8a6",
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
        <h3 className="font-semibold mb-4">Complaint Terbaru</h3>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-2">Judul</th>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Kategori</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {complaints
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .slice(0, 10)
              .map((c) => (
                <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{c.title}</td>
                  <td className="px-4 py-2">{c.user?.name || "-"}</td>
                  <td className="px-4 py-2">{c.category?.name || "-"}</td>
                  <td className="px-4 py-2 capitalize">{c.status}</td>
                  <td className="px-4 py-2">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

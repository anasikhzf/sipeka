// services/userService.js

const API_BASE = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_BASE}/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mengambil data pengguna");
  return res.json();
};

export const getUserComplaints = async () => {
  const res = await fetch(`${API_BASE}/my-complaints`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mengambil data keluhan");
  return res.json();
};

export const getUserResponses = async () => {
  const res = await fetch(`${API_BASE}/responses`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mengambil data tanggapan");
  return res.json();
};

export const submitUserRating = async ({ complaint_id, rating, feedback }) => {
  const res = await fetch(`${API_BASE}/ratings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ complaint_id, rating, feedback }),
  });
  if (!res.ok) throw new Error("Gagal mengirim rating");
  return res.json();
};

# SIPEKA 🎓🛠️  
**Sistem Informasi Pengaduan Keluhan dan Aspirasi Mahasiswa**

SIPEKA adalah aplikasi berbasis web yang memungkinkan mahasiswa untuk menyampaikan keluhan atau aspirasi mereka terkait fasilitas, layanan kampus, atau hal lainnya kepada pihak kampus. Aplikasi ini dikembangkan sebagai bagian dari Final Project dalam program Studi Independen Bersertifikat (SIB) bersama **NF Academy**.

## ✨ Fitur Utama

- 🔐 **Autentikasi Pengguna**: Login untuk pengguna dan admin
- 📝 **Pengajuan Keluhan/Aspirasi**: Mahasiswa dapat mengajukan pengaduan melalui formulir online
- 📊 **Dashboard Admin Lengkap**:
  - Lihat, tanggapi, dan ubah status pengaduan
  - Kelola data **complaints**, **respons**, **ratings**, **kategori pengaduan**, **attachments**, dan **pengguna**
- 📁 **Riwayat Pengaduan**: Mahasiswa dapat melihat status dan tanggapan atas pengaduan mereka

## 👥 Peran Pengguna

### 1. Mahasiswa (User)
- Mendaftar & Login ke sistem
- Mengisi dan mengirim form pengaduan
- Melihat status pengaduan

### 2. Admin
Admin memiliki **akses penuh (CRUD)** terhadap seluruh data dalam sistem:
- 📌 **Keluhan (Complaints)**: Melihat, mengedit, menghapus, dan memperbarui status
- 📎 **Lampiran (Attachments)**: Mengelola file yang dikirim oleh user
- 💬 **Tanggapan (Responses)**: Memberikan respons terhadap keluhan
- ⭐ **Rating**: Melihat feedback dari mahasiswa
- 🗂️ **Kategori Pengaduan**: Menambah, mengedit, dan menghapus kategori
- 👥 **Pengguna**: Melihat dan mengatur data mahasiswa (jika diperlukan)

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Reactjs
- **Backend**: PHP Laravel 12 
- **Database**: MySQL
- **Tools**: VS Code, Laragon, phpMyAdmin, GitHub

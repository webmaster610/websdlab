# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Proyek: Website Resmi & Sistem Otomasi SD Kristen Satya Wacana Salatiga (SD Lab UKSW)

---

## 1. PENDAHULUAN & PROFIL SEKOLAH

### 1.1 Identitas Resmi
- **Nama Sekolah**: SD Kristen Satya Wacana Salatiga (SD Lab UKSW)
- **Akreditasi**: "A" (Unggul)
- **Afiliasi**: Sekolah Laboratorium di bawah naungan Universitas Kristen Satya Wacana (UKSW)
- **Alamat**: Jl. Yos Sudarso No. 1, Salatiga 50711, Jawa Tengah
- **Kontak**: Telepon (0298) 323660 | WhatsApp: 081390304093 | Email: sdlab.uksw@gmail.com
- **Media Sosial**: Instagram @sdksatyawacana | TikTok @sdkristen.satyawa
- **Visi Kurikulum (KSP 2025/2026)**:
  > *"Terwujudnya Peserta Didik yang Inovatif, Berkembang secara Holistik, dan Berwawasan Global dengan Kasih."*
- **Tagline Utama**:
  > *"Membentuk Generasi Inovatif, Holistik, dan Berwawasan Global berdasarkan Kasih"*

### 1.2 Pilar Keunggulan (Unique Value Propositions)
1. **Akses Laboratorium UKSW**: Pemanfaatan fasilitas robotika, coding, AI (FTI), laboratorium sains (FSM), studio bahasa (FBS), dan dosen tamu UKSW.
2. **Kemitraan Internasional**: Kolaborasi global dengan Kwansei Gakuin University, Jepang.
3. **Deep Learning & Humanizing Education**: Pembelajaran yang bermakna (*Meaningful*), penuh kesadaran (*Mindful*), dan membahagiakan (*Joyful*).
4. **Rapor Mutu Kemendikbudristek Unggul**: Indeks Literasi 81.76 (Sangat Tinggi / Baik), Iklim Keamanan & Kebinekaan Inklusif ("Indonesia Mini").

---

## 2. ARSITEKTUR & SISTEM OTOMASI PRESTASI SISWA

### 2.1 Latar Belakang Masalah
Prestasi siswa di SD Kristen Satya Wacana bersifat sangat dinamis dan berfrekuensi tinggi. Pengelolaan manual melalui edit kode HTML menimbulkan beberapa kendala:
1. Guru/koordinator kesiswaan kesulitan memperbarui data secara cepat.
2. Menumpuknya foto prestasi bertahun-tahun di repositori git menyebabkan kapasitas penyimpanan (*repository storage*) membengkak (*bloated*).
3. Informasi prestasi lama yang tetap tayang menurunkan relevansi dan keterbaruan website.

### 2.2 Solusi Sistem
Sistem end-to-end berbasis Telegram Bot, JSON Data Store, Auto-Prune Engine, dan Dynamic Web Showcase:
1. **Frontend**:
   - Beranda (`index.html`): Carousel Slider Prestasi Terhangat (Owl Carousel).
   - Halaman Khusus (`prestasi.html`): Galeri lengkap dengan Realtime Instant Search & Pill Filter Tabs.
   - Lightbox Modal Popup: Menampilkan foto ukuran penuh asli (tanpa terpotong) disertai detail lengkap (ajang lomba, sub-kategori, tanggal, lokasi, dan penyelenggara).
2. **Backend / Bot**:
   - Skrip bot Node.js mandiri (`scripts/bot.js`) dengan Long-Polling engine.
   - Parser Cerdas (Smart NLP Parser) yang mampu membaca format laporan bebas/WhatsApp dari guru.
   - Alur Persetujuan Admin (*Approval Workflow*): Tombol interaktif `[✅ Setujui & Tayangkan]` dan `[❌ Tolak]`.
   - Manajemen Hapus Mandiri (`/kelola` dan `/hapus <ID>`) dengan konfirmasi keamanan anti-salah pencet.
   - Otomatis download foto ke `images/prestasi/`, modifikasi `data/prestasi.json`, dan Git commit & push langsung ke GitHub.

---

## 3. ATURAN RETENSI MASA AKTIF (TIME TO LIVE / TTL)

Untuk menjaga relevansi informasi dan kapasitas memori repositori git:

| Tingkat Kejuaraan | Capaian / Peringkat | Masa Aktif Tayang (TTL) | Tindakan Kadaluarsa |
| :--- | :--- | :--- | :--- |
| **Kecamatan & Kota** | Juara 2, Juara 3, Harapan | **3 Bulan** | Data & foto fisik dihapus otomatis |
| **Kecamatan & Kota** | Juara 1 (Juara Utama) | **6 Bulan** | Data & foto fisik dihapus otomatis |
| **Provinsi, Nasional, Internasional** | Semua Juara | **Abadi (Evergreen)** | Tayang terus kecuali dihapus manual oleh Admin |

### Mekanisme Pembersihan (Double Protection):
1. **Soft-Expiry (Client-Side)**: Browser otomatis menyembunyikan kartu prestasi yang tanggal `expires_at`-nya telah lewat.
2. **Hard-Expiry (Skrip Auto-Prune)**: `scripts/cleanup-prestasi.js` memindai `data/prestasi.json`, menghapus entri kadaluarsa, dan **menghapus file foto fisiknya dari folder `images/prestasi/`**.

---

## 4. STRUKTUR DATA & DUAL-CATEGORY SYSTEM

### 4.1 Perbedaan Dua Jenis Kategori
- **Rumpun Bidang Web (Kategori Utama Sekolah)**:
  - `Akademik & Sains` (`akademik`)
  - `Seni & Kreativitas` (`seni`)
  - `Olahraga Prestasi` (`olahraga`)
  - `IPTEK & Robotika` (`robotika`)
  *Fungsi*: Sebagai tab filter utama di galeri website.
- **Kategori Khusus Ajang Lomba (Sub-Kategori Juknis Lomba)**:
  - Diambil dari inputan spesifik guru (contoh: *Futsal Junior U-12*, *Busana Daur Ulang*, *Catur Perorangan Putra*).
  *Fungsi*: Ditampilkan di dalam Lightbox Modal saat kartu diklik (tidak ditampilkan di kartu depan agar kartu tetap ringkas).

### 4.2 Skema Data JSON (`data/prestasi.json`)
```json
{
  "id": 6,
  "title": "Juara 2 • Tingkat Kota - Lomba Dance Ajang GIHN UKSW",
  "badge": "Juara 2 • Tingkat Kota",
  "badge_class": "badge-silver",
  "student_name": "Isabella Leticia Aqueena & Leona Andara Suprapto",
  "student_class": "Kelas 6A",
  "competition": "Lomba Dance Ajang GIHN UKSW",
  "sub_category": "Juara Best Costume & Juara Umum 2",
  "competition_date": "10 September 2026",
  "location": "UKSW Salatiga",
  "organizer": "UKSW Salatiga",
  "category": "Seni & Kreativitas",
  "category_key": "seni",
  "level": "kota",
  "rank": 2,
  "created_at": "2026-09-26",
  "expires_at": "2026-12-26",
  "image": "images/prestasi/prestasi_1790404097667.jpg",
  "featured": true
}
```

---

## 5. ALUR KERJA TELEGRAM BOT & KEAMANAN (SECURITY)

### 5.1 Hak Akses Pengguna
- **Guru, Koordinator Kesiswaan, Orang Tua, Siswa**:
  - Mengirimkan laporan foto dan keterangan teks.
  - Perintah yang diizinkan: `/start`, `/help`, `/list` (read-only).
- **Admin Utama (Chat ID Terverifikasi di `.env`)**:
  - Menerima pesan draf verifikasi lengkap.
  - Menyetujui atau menolak draf (`[✅ Setujui]`, `[❌ Tolak]`).
  - Mengelola dan menghapus prestasi via Telegram (`/kelola`, `/hapus <ID>`).
  - Menjalankan pembersihan retensi manual (`/cleanup`).

### 5.2 Standar Kerahasiaan Kredensial
- Seluruh token (`TELEGRAM_BOT_TOKEN`, `ADMIN_CHAT_ID`) disimpan di file `.env`.
- File `.env` **wajib** terdaftar di `.gitignore` dan **dilarang keras** di-push ke repositori GitHub publik.

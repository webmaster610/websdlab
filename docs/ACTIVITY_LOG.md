# BUKU LOG AKTIVITAS & AUDIT TRAIL SISTEM
## SD Kristen Satya Wacana Salatiga (SD Lab UKSW)

Dokumen ini adalah **Log Audit Otomatis (System Audit Trail)** yang mencatat secara kronologis seluruh penambahan, pengubahan, penolakan, dan penghapusan data pada ekosistem website dan sistem otomatisasi prestasi SD Kristen Satya Wacana.

Setiap kali Admin menyetujui, menolak, atau menghapus prestasi melalui Bot Telegram, maupun saat sistem pembersihan otomatis (*auto-prune*) berjalan, riwayatnya akan **langsung tercatat secara otomatis** pada dokumen ini dan tersimpan di database `data/activity_log.json`.

---

## 📊 RINGKASAN STATISTIK AKTIVITAS

- **Total Prestasi Aktif di Website**: 7 Prestasi
- **Total Riwayat Tercatat**: 10 Log Aktivitas
- **Status Server Produksi**: Online 24/7 (`sdlabubuntuserver` di UKSW Salatiga)
- **Engine Otomasi**: Node.js Long-Polling Telegram Bot & PM2 Daemon (`sdlab-prestasi-bot`)
- **Pembaruan Terakhir**: 26 September 2026

---

## 📜 TABEL RIWAYAT AKTIVITAS & PERUBAHAN SISTEM

| Waktu (WIB) | Aksi | ID | Nama Subjek / Entri | Ajang / Capaian | Kategori & Bidang | Aktor / Eksekutor | Keterangan & Masa Aktif |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2026-09-26 22:06** | `TESTIMONI` | **-** | **Pak Jasson** (Orang Tua Siswa Kelas 4 & 6) | Kesan & Testimoni Orang Tua Murid (*Orang Tua Kelas 4 & 6*) | Testimoni | Webmaster / Admin | Penambahan testimoni autentik Pak Jasson pada carousel beranda dan profil sekolah. |
| **2026-09-26 14:27** | `TAMBAH` | **#7** | **Damara Aqila Kiandra** (Kelas 6A) | Gelar Inovasi Harmoni Nusantara (*Juara 3 • Tingkat Kota*) | IPTEK & Robotika | Admin (`7187970534`) | Otomatis via Ubuntu Server. Exp: 2026-12-26 |
| **2026-09-26 13:48** | `TAMBAH` | **#6** | **Isabella Leticia Aqueena & Leona Andara Suprapto** (Kelas 6A) | Lomba Dance Ajang GIHN UKSW (*Juara 2 • Tingkat Kota*) | Seni & Kreativitas | Admin (`7187970534`) | Sub-Kategori: Best Costume & Juara 2. Exp: 2026-12-26 |
| **2026-09-26 10:15** | `TAMBAH` | **#5** | **Nathaniel Timothy** (Kelas 5) | Kompetisi Robotika Cilik (*Harapan 1 • Regional*) | IPTEK & Robotika | Sistem (Inisialisasi) | Laboratorium FTI UKSW. Exp: 2026-12-26 |
| **2026-09-26 10:15** | `TAMBAH` | **#4** | **Tim Basket SD Satya Wacana** (Tim Prestasi) | Kejuaraan Bola Basket Pelajar (*Juara 2 • Karesidenan*) | Olahraga Prestasi | Sistem (Inisialisasi) | GOR Kridanggo Salatiga. Exp: 2026-12-26 |
| **2026-09-26 10:15** | `TAMBAH` | **#3** | **David Chris Immanuel** (Kelas 4) | Kejuaraan Renang Antar-SD Jateng (*Medali Emas • Provinsi*) | Olahraga Prestasi | Sistem (Inisialisasi) | **Abadi (Evergreen)** Tingkat Provinsi Jawa Tengah |
| **2026-09-26 10:15** | `TAMBAH` | **#2** | **Jonathan Putra** (Kelas 4) | Festival Lomba Seni Siswa FLS2N (*Juara 1 • Tingkat Kota*) | Seni & Kreativitas | Sistem (Inisialisasi) | BPTI Kemendikbud. Exp: 2027-03-26 (6 Bulan) |
| **2026-09-26 10:15** | `TAMBAH` | **#1** | **Kezia Aurelia** (Kelas 5) | Olimpiade Sains Nasional OSN (*Juara 1 • Tingkat Kota*) | Akademik & Sains | Sistem (Inisialisasi) | Kemitraan FSM UKSW. Exp: 2027-03-26 (6 Bulan) |
| **2026-09-26 09:30** | `UPDATE_GTK` | `-` | **Guru & Tenaga Kependidikan** | Pembaruan Daftar 26 Personil GTK Resmi | Kepegawaian GTK | Webmaster / Admin | Tambah 9 GTK baru & catat purna tugas 2 guru pensiun |
| **2026-09-26 09:00** | `KOREKSI` | `-` | **Kak Kempo** | Koreksi Konteks Profil Tokoh Dongeng | Literasi Karakter | Webmaster / Admin | Koreksi posisi sebagai Aktivis Pendongeng Anak Nasional |
| **2026-09-26 08:30** | `INTEGRASI`| `-` | **Media Sosial Resmi** | Integrasi Akun TikTok (@sdkristen.satyawa) | Media Komunikasi | Webmaster / Admin | Pemasangan tautan TikTok di seluruh footer website |

---

## 🔍 RINCIAN AUDIT LOG TERKINI (LOG BERJALAN)

### Log #1: Penayangan Prestasi #7 (Damara Aqila Kiandra)
- **ID Prestasi**: `#7`
- **Waktu Eksekusi**: 26 September 2026, 14:27:50 WIB
- **Tipe Aksi**: `TAMBAH` (Approved & Published)
- **Aktor**: Admin Utama (Chat ID: `7187970534`)
- **Data Masuk**:
  - Siswa: Damara Aqila Kiandra (Kelas 6A)
  - Lomba: Gelar Inovasi Harmoni Nusantara
  - Capaian: Juara 3 • Tingkat Kota
  - Bidang: IPTEK & Robotika
  - Waktu Pelaksanaan: 10 September 2026
  - Tempat: BU UKSW Salatiga
  - Foto: `images/prestasi/prestasi_1790407270396.jpg`
- **Masa Aktif**: Aktif s.d 26 Desember 2026 (3 Bulan - Auto-Prune)
- **Status Komit**: `feat(prestasi): tayangkan prestasi #7 Damara Aqila Kiandra [skip ci]`

---

### Log #2: Penayangan Prestasi #6 (Isabella Leticia & Leona Andara)
- **ID Prestasi**: `#6`
- **Waktu Eksekusi**: 26 September 2026, 13:48:17 WIB
- **Tipe Aksi**: `TAMBAH` (Approved & Published)
- **Aktor**: Admin Utama (Chat ID: `7187970534`)
- **Data Masuk**:
  - Siswa: Isabella Leticia Aqueena & Leona Andara Suprapto (Kelas 6A)
  - Lomba: Lomba Dance Ajang GIHN UKSW
  - Capaian: Juara 2 • Tingkat Kota
  - Sub-Kategori: Juara Best Costume & Juara Umum 2
  - Bidang: Seni & Kreativitas
  - Waktu Pelaksanaan: 10 September 2026
  - Tempat: UKSW Salatiga
  - Foto: `images/prestasi/prestasi_1790404097667.jpg`
- **Masa Aktif**: Aktif s.d 26 Desember 2026 (3 Bulan - Auto-Prune)

---

## ⚙️ MEKANISME AUDIT LOG OTOMATIS

Semua perubahan data prestasi diatur oleh skrip backend:
1. **Penambahan Prestasi Baru**: Saat Admin menekan `[✅ Setujui & Tayangkan]`, fungsi pencatat audit otomatis memasukkan entri `TAMBAH` ke berkas ini dan `data/activity_log.json`.
2. **Penghapusan Prestasi**: Saat Admin menjalankan `/hapus <ID>` atau memilih menu `/kelola`, aksi pencatatan otomatis memasukkan entri `HAPUS` beserta alasan dan foto yang dimusnahkan.
3. **Pembersihan Kadaluarsa (Auto-Prune)**: Saat skrip retensi berjalan dan membersihkan entri kadaluarsa, aksi pencatatan otomatis memasukkan entri `AUTO_PRUNE`.
4. **Git Sync**: Setiap pembaruan log ini otomatis diikutsertakan dalam `git commit & push` ke repositori utama.

# BUKU LOG AKTIVITAS & AUDIT TRAIL SISTEM
## SD Kristen Satya Wacana Salatiga (SD Lab UKSW)

Dokumen ini adalah **Log Audit Otomatis (System Audit Trail)** yang mencatat secara kronologis seluruh penambahan, pengubahan, penolakan, dan penghapusan data pada ekosistem website dan sistem otomatisasi prestasi SD Kristen Satya Wacana.

Setiap kali Admin menyetujui, menolak, atau menghapus prestasi melalui Bot Telegram, maupun saat sistem pembersihan otomatis (*auto-prune*) berjalan, riwayatnya akan **langsung tercatat secara otomatis** pada dokumen ini dan tersimpan di database `data/activity_log.json`.

---

## 📊 RINGKASAN STATISTIK AKTIVITAS

- **Total Prestasi Aktif di Website**: 7 Prestasi
- **Total Riwayat Tercatat**: 35 Log Aktivitas
- **Status Server Produksi**: Online 24/7 (`sdlabubuntuserver` di UKSW Salatiga)
- **Engine Otomasi**: Node.js Long-Polling Telegram Bot & PM2 Daemon (`sdlab-prestasi-bot`)
- **Pembaruan Terakhir**: 06 Oktober 2026

---

## 📜 TABEL RIWAYAT AKTIVITAS & PERUBAHAN SISTEM

| Waktu (WIB) | Aksi | ID | Nama Subjek / Entri | Ajang / Capaian | Kategori & Bidang | Aktor / Eksekutor | Keterangan & Masa Aktif |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2026-10-06 18:25 WIB** | `OPTIMASI_A11Y` | **#-** | **Optimasi Aksesibilitas WCAG & Eliminasi Render-Blocking Mobile** (-) | Resolusi Penuh Audit Aksesibilitas (85 -> 95+) & Performa Mobile (*A11y & Speed 95+*) | Aksesibilitas & Performa | Webmaster / Admin | Menyelesaikan seluruh temuan audit Lighthouse: eliminasi konflik role='presentation' & nama tombol Carousel/Navbar, perbaikan hirarki heading berurutan (h1->h2->h3->h4), peningkatan kontras warna teks melampaui 4.5:1 (WCAG AA), penyesuaian ukuran touch target minimum 48x48px, eliminasi render-blocking CSS (hemat ~1,790ms), penggantian unminified jQuery (hemat 182KB), pencopotan jquery-migrate (hemat 11.4KiB legacy JS), dan penerbitan style.min.css (hemat 65.8KB). |
| **2026-10-06 17:35 WIB** | `UPDATE_PERFORMA` | **#-** | **Penerapan Font-Display Swap & Preconnect Google Fonts** (-) | Eliminasi Latensi Font Display (Est Savings 550ms) (*Hemat 550ms Font*) | Performa & Tipografi | Webmaster / Admin | Menyematkan parameter &display=swap dan rel="preconnect" untuk Google Fonts pada seluruh 7 halaman utama, serta menambahkan aturan font-display: swap pada @font-face di flaticon.css, icomoon.css, ionicons.min.css, dan open-iconic-bootstrap.min.css untuk mengeliminasi FOIT (Flash of Invisible Text) dan menghemat 550ms waktu tunggu render font. |
| **2026-10-06 17:25 WIB** | `UPDATE_SEO` | **#-** | **Resolusi Audit Cloudflare Pages & Lighthouse SEO/Best Practices** (-) | Perbaikan robots.txt, sitemap.xml, Meta Description, CLS Guard, & Konsol Error (*Lighthouse 100/100*) | SEO & Standar Web | Webmaster / Admin | Memperbaiki kegagalan robots.txt (1052 error akibat fallback HTML Cloudflare Pages) dengan membuat file robots.txt & sitemap.xml standar, menyematkan meta description di 7 halaman utama, menghapus script Google Maps mati pemicu console error, menyematkan CLS guard pada Owl Carousel, serta menyediakan manifest llms.txt & ai-catalog.json untuk Agentic Browsing. |
| **2026-10-06 16:40 WIB** | `UPDATE_PERFORMA` | **#-** | **Batch Resize 54 Gambar & Lazy Loading** (-) | Kompresi Aset Web & Peningkatan Kecepatan Mobile (*Hemat 23.58 MB / 72.8%*) | Performa & Kecepatan | Webmaster / Admin | Eksekusi batch resize dan re-encoding 54 file gambar raksasa (logo.png dari 758KB ke 73KB, hero slider, foto kegiatan 6K, avatar testimoni), memangkas folder images dari 32.39 MB ke 8.81 MB (hemat 23.58 MB / 72.8%), serta memasang native loading='lazy', dimensi logo anti-CLS, dan link preload LCP hero. |
| **2026-10-06 08:30 WIB** | `HAPUS` | **#7** | **Team Basket Sd Kristen Satya Wacana (Shannon (Kelas 5a), Caelyn (Kelas 6a), Jevan (Kelas 6a), Jorell (Kelas 5a), Ernest (Kelas 4a), Kayla (Kelas 6b), Fidel (Kelas 6a), Samuel (Kelas 5a), Andrew (Kelas 6a), Eta (Kelas 5a), Jass (Kelas 6a), Dan Odel (Kelas 6b))** (Kelas 4-6) | Bank Jateng Liga Basket (Bjlb) (*Juara 3 • Tingkat Kota*) | Olahraga Prestasi | Admin (7187970534) | Dihapus manual oleh Admin via Telegram. |
| **2026-10-06 08:28 WIB** | `TAMBAH` | **#7** | **Team Basket Sd Kristen Satya Wacana (Shannon (Kelas 5a), Caelyn (Kelas 6a), Jevan (Kelas 6a), Jorell (Kelas 5a), Ernest (Kelas 4a), Kayla (Kelas 6b), Fidel (Kelas 6a), Samuel (Kelas 5a), Andrew (Kelas 6a), Eta (Kelas 5a), Jass (Kelas 6a), Dan Odel (Kelas 6b))** (Kelas 4-6) | Bank Jateng Liga Basket (Bjlb) (*Juara 3 • Tingkat Kota*) | Olahraga Prestasi | Admin (7187970534) | Disetujui Admin. Masa aktif: s.d 2027-01-06 |
| **2026-10-02 08:16 WIB** | `UPDATE_KONTEN` | **#-** | **Redesain Tautan Baca Selengkapnya & Footer Kartu Berita** (-) | Penerapan Tautan Editorial Anggun (Opsi A) & Aliansi Tag Metadata (*Opsi A: Editorial Link*) | Desain & Tata Letak | Webmaster / Admin | Mengganti tombol kapsul oranye yang sempit/patah dengan tautan editorial modern "Baca Selengkapnya →" (#0d83ff dengan hover #fd5f00 dan animasi panah meluncur), menyeragamkan tag lokasi kanan (Jepang / UKSW, Solo Safari, Sangiran), dan menambahkan garis batas atas halus pada kartu berita di index.html dan blog.html. |
| **2026-10-01 09:57 WIB** | `UPDATE_KONTEN` | **#-** | **Galeri Segaris Penuh Profil Sekolah** (-) | Restorasi 4 Foto Galeri Segaris Penuh di about.html (*Galeri Segaris Penuh*) | Desain & Tata Letak | Webmaster / Admin | Memperbaiki 2 slot gambar galeri yang sebelumnya gagal tampil akibat spasi URL tanpa tanda kutip di about.html, kini menampilkan 4 foto pilar sekolah secara penuh segaris (100% lebar) persis seperti halaman depan. |
| **2026-10-01 09:18 WIB** | `TESTIMONI` | **#-** | **Bu Septi** (Orang Tua Siswa Kelas 4) | Kesan & Testimoni Orang Tua Murid (*Orang Tua Kelas 4*) | Testimoni | Webmaster / Admin | Penambahan testimoni autentik Bu Septi (Orang Tua Siswa Kelas 4) pada carousel testimoni di index.html dan about.html, melengkapi 4 suara apresiasi orang tua murid. |
| **2026-09-29 22:45 WIB** | `UPDATE_KONTEN` | **#-** | **Equal-Height Program & Framing Mahasiswa Jepang** (-) | Grid Equal Height Program & Promosi Mahasiswa Jepang ke Posisi #1 (*Equal Height & Hero #1*) | Desain & Tata Letak | Webmaster / Admin | Penyelarasan tinggi kartu Program & Ekstrakurikuler dengan equal-height flexbox, pemotongan horisontal fokus Mao Sensei & interaksi siswa (images/jepang_ngajar_banner.webp), pemindahan Berita Mahasiswa Jepang ke posisi #1 di Beranda dan Kegiatan Siswa, serta pembersihan markup duplikat di index.html. |
| **2026-09-29 22:20 WIB** | `UPDATE_KONTEN` | **#-** | **13 Foto Otentik Kegiatan & Ekskul Baru** (-) | Integrasi Foto Kemitraan Jepang, Gelar Karya P5, Ekskul & Budaya (*13 Foto Otentik*) | Dokumentasi Sekolah | Webmaster / Admin | Pemasangan foto otentik pada courses.html (paduan suara, basket, pramuka, dan kelas jepang baru), penambahan 6 kegiatan tematik baru di blog.html, pembaruan galeri about.html, dan 6 entri berita unggulan di index.html. |
| **2026-09-29 21:35 WIB** | `UPDATE_GTK` | **#-** | **Eliminasi Distorsi & Framing Ramping Pak Seto** (-) | Zero-Distortion Aspect Ratio Guard (800:940) & Slim Framing Pak Seto (*29 Foto 100% Alami*) | Kepegawaian GTK | Webmaster / Admin | Perbaikan aspek rasio eksak 800:940 mencegah foto tertekan/bentet (Bu Lanni, Pak Gani, Pak Yudha), serta pemotongan di atas lingkar pinggang Pak Seto agar tampil lebih ramping, tegap, dan proporsional. |
| **2026-09-29 21:25 WIB** | `UPDATE_GTK` | **#-** | **Framing Medium Bust 29 Foto & Gelar Bu Deti** (-) | Kalibrasi Foto Mundur & Naikkan Gestur, Koreksi Gelar, dan Switch Formasi (*29 Foto Medium Bust*) | Kepegawaian GTK | Webmaster / Admin | Penerapan framing medium bust (mundur ~15-20% & naikkan badan), pose victory Bu Lanni utuh, buku Bu Dyah terlihat jelas, Pak Seto dinaikkan sejajar berambut, penambahan gelar Bu Deti (M.Pd.), nama lengkap Bu Maria Cristiana Yulianti Djari, dan switch figur ke-4 di Beranda. |
| **2026-09-28 22:45 WIB** | `UPDATE_GTK` | **#-** | **Kuncian Lebar 100% & Struktur Jabatan 2 Baris** (-) | Redesain 2-Tier Role Box & Kuncian Lebar Card 100% Anti-Penyok (*29 Card Sempurna*) | Kepegawaian GTK | Webmaster / Admin | Pemberian width: 100% !important pada .staff mencegah card menyusut/melebar akibat panjang nama, pemisahan jabatan ke format 2 tingkat (.primary-role & .sub-role) tanpa karakter slash, dan pembaruan profil Pak Rah Seto Sumirat murni sebagai Wali Kelas. |
| **2026-09-28 22:30 WIB** | `UPDATE_GTK` | **#-** | **Framing Lega 29 Foto & Kuncian 405px** (-) | Kalibrasi Relaxed Bust Portrait (Anti-Sempit) & Kuncian 405px (*29 Foto Kalibrasi Lega*) | Kepegawaian GTK | Webmaster / Admin | Pelegaan ruang udara atas (headroom 18-24%) dan rasio wajah 32.5% pada ke-29 foto sehingga tidak sempit/mepet, bahu dan dada seragam batik tampak utuh, dan kartu terkunci 405px seragam. |
| **2026-09-28 22:15 WIB** | `UPDATE_GTK` | **#-** | **Grid 4 Kolom & Desain Ringkas GTK** (-) | Redesain Kartu GTK 4 Kolom & Figur Beranda (*29 Profil Minimalis*) | Kepegawaian GTK | Webmaster / Admin | Penerapan grid 4 kolom di teacher.html agar dada tampak pas, hapus teks deskripsi naratif untuk tampilan bersih, dan ganti kartu depan ke-4 ke Pak Ari Pujianto. |
| **2026-09-28 22:05 WIB** | `UPDATE_GTK` | **#-** | **29 Pendidik & Tenaga Kependidikan** (-) | Optimalisasi Framing Foto 29 GTK & Gelar Pak Deo (*29 Personil Resmi*) | Kepegawaian GTK | Webmaster / Admin | Optimalisasi framing foto 29 GTK via AI Face Detection (bebas terbalik & bebas terpotong), penambahan gelar Albert Deo Saputra, S.Pd., dan penataan pimpinan terdepan. |
| **2026-09-28 03:35 WIB** | `TAMBAH` | **#6** | **Kaleb Deven Kristyanto** (Kelas 6A) | Kejuaraan Catur Museum Ambarawa Cup 1 (*Juara 2 • Tingkat Provinsi*) | Olahraga Prestasi | Admin (7187970534) | Disetujui Admin. Masa aktif: Abadi (Evergreen) |
| **2026-09-28 10:26 WIB** | `TESTIMONI` | **#-** | **Y.B. Indrianto, ST** (Orang Tua Siswa Kelas 6) | Kesan & Testimoni Orang Tua Murid (*Orang Tua Kelas 6*) | Testimoni | Webmaster / Admin | Penambahan testimoni autentik Y.B. Indrianto, ST menggantikan kartu template di beranda dan profil sekolah. |
| **2026-09-27 21:30 WIB** | TESTIMONI | **#-** | **Bu Devina** (Orang Tua Siswa Kelas 3) | Kesan & Testimoni Orang Tua Murid (*Orang Tua Kelas 3*) | Testimoni | Webmaster / Admin | Penambahan testimoni autentik Bu Devina menggantikan kartu template di beranda dan profil sekolah. |
| **2026-09-27 14:20 WIB** | `HAPUS` | **#6** | **Isabella Leticia Aqueena Dan Leona Andara Suprapto** (Kelas 6A) | Lomba Dance Ajang Gihn Uksw (*Juara 2 • Tingkat Kota*) | Seni Vokal & Musik | Admin (7187970534) | Dihapus manual oleh Admin via Telegram. |
| **2026-09-27 14:18 WIB** | `TAMBAH` | **#6** | **Isabella Leticia Aqueena Dan Leona Andara Suprapto** (Kelas 6A) | Lomba Dance Ajang Gihn Uksw (*Juara 2 • Tingkat Kota*) | Seni Vokal & Musik | Admin (7187970534) | Disetujui Admin. Masa aktif: s.d 2026-12-27 |
| **2026-09-27 14:13 WIB** | `HAPUS` | **#6** | **Isabella Leticia Aqueena & Leona Andara Suprapto** (Kelas 6A) | Lomba Dance Ajang GIHN UKSW (*Juara 2 • Tingkat Kota*) | Seni & Kreativitas | Admin (7187970534) | Dihapus manual oleh Admin via Telegram. |
| **2026-09-27 21:00 WIB** | `HAPUS` | **#7** | **Damara Aqila Kiandra** (Kelas 6A) | Gelar Inovasi Harmoni Nusantara (*Juara 3 • Tingkat Kota*) | IPTEK & Robotika | Admin (`7187970534`) | Dihapus manual oleh Admin via Telegram. Data dan foto dibersihkan. |
| **2026-09-26 15:20 WIB** | `PULIHKAN` | **#-** | **Pak Jasson & Kartu Pendamping** (-) | Restorasi Kartu Testimoni Pendamping Sementara (*Testimoni Aktif*) | Testimoni | Webmaster / Admin | Mengembalikan kartu testimoni pendamping sementara agar slider carousel tetap penuh, berputar, dan dinamis, dengan Pak Jasson tetap di posisi utama. |
| **2026-09-26 15:14 WIB** | `BERSIHKAN` | **#-** | **Testimoni Template Generik** (-) | Pembersihan Komentar Template Non-Autentik (*Testimoni Bersih*) | Testimoni | Webmaster / Admin | Menghapus seluruh komentar template bawaan di beranda dan profil, menyisakan testimoni asli Pak Jasson dengan carousel auto-adaptif. |
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

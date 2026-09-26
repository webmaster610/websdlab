# CHANGELOG & CATATAN PERUBAHAN
## Proyek: Website Resmi SD Kristen Satya Wacana Salatiga (SD Lab UKSW)

Format pencatatan perubahan berdasar prinsip [Keep a Changelog](https://keepachangelog.com/id/1.0.0/):
- **Added** (Penambahan fitur atau data baru)
- **Changed** (Perubahan fungsionalitas atau tampilan yang sudah ada)
- **Fixed** (Perbaikan bug, typo, atau kesalahan penempatan)
- **Removed** (Penghapusan data atau komponen)
- **Security** (Peningkatan keamanan dan kerahasiaan)

---

## [Unreleased] - 2026-09-26

### 1. PENGELOLAAN GURU & TENAGA KEPENDIDIKAN (GTK)
- **Added**: Penambahan 9 Guru dan Tenaga Kependidikan baru ke dalam daftar GTK resmi di `teacher.html`:
  1. YOHANA BALAMBEU, S. Si. Teol. (Guru Agama Kristen)
  2. NIMAS PERDANA FORTUNA DEWI, S. Pd. (Wali Kelas 1)
  3. ABED NEGO WISNU MURDOKO, S.S.I (Pustakawan)
  4. MEIMONITA KRISETIAWATI, S.I.Kom (Administrasi)
  5. BAGUS SETIAJI (Keamanan)
  6. HARTANTO (Keamanan)
  7. SURYA WIJAYA (Keamanan)
  8. YEHUDA SUPARNO PUTRA (Pekarya)
  9. GUNTUR WICAKSONO (Administrasi)
- **Removed**: Pengurangan 2 staf guru yang telah purna tugas (pensiun) tahun ini:
  1. Ibu Suprihastuti (Wali Kelas)
  2. Bapak Pujiono (Guru)
- **Changed**: Penyesuaian total GTK aktif menjadi 26 personil dengan tata letak grid *equal-height*.

---

### 2. KOREKSI KONTEKS TOKOH: KAK KEMPO
- **Fixed**: Mengoreksi kekeliruan penempatan Kak Kempo di `courses.html` yang sebelumnya masuk ke rumpun bela diri Shorinji Kempo.
- **Changed**: Menegaskan profil Kak Kempo sebagai **Aktivis Pendongeng Anak Nasional dari Kota Semarang** yang membawakan panggung dongeng inspiratif dan penguatan literasi karakter di SD Kristen Satya Wacana.
- **Changed**: Mengubah judul rumpun bela diri di `courses.html` menjadi **Rumpun Olahraga Prestasi (Taekwondo & Pencak Silat)**.

---

### 3. INTEGRASI MEDIA SOSIAL RESMI
- **Added**: Penambahan akun TikTok resmi sekolah `@sdkristen.satyawa` di seluruh footer website (`index.html`, `about.html`, `courses.html`, `teacher.html`, `blog.html`, `contact.html`, `prestasi.html`) mendampingi akun Instagram `@sdksatyawacana` dan WhatsApp resmi `081390304093`.

---

### 4. TAHAP 1: TRANSFORMASI CAROUSEL PRESTASI DINAMIS
- **Added**: Struktur model data JSON terpusat di `data/prestasi.json` yang menampung daftar prestasi siswa.
- **Added**: Styling carousel modern `.carousel-prestasi.owl-carousel` dengan kartu `.prestasi-card` pada `css/style.css`.
- **Added**: Inisialisasi Owl Carousel di `js/main.js` (autoplay 4.5s, hover pause, responsive 1/2/3 item).
- **Changed**: Mengganti tabel statis 4 kartu lama di `index.html` menjadi Carousel Slider Dinamis yang responsif.
- **Added**: 5 entri prestasi autentik perdana:
  1. Kezia Aurelia (Juara 1 OSN Sains SD)
  2. Jonathan Putra (Juara 1 Solo Vokal FLS2N)
  3. David Chris Immanuel (Medali Emas Kejurda Renang)
  4. Tim Basket SD Satya Wacana (Juara 2 Turnamen Basket Pelajar)
  5. Nathaniel Timothy (Juara Harapan 1 Robotika Cilik)

---

### 5. TAHAP 2: HALAMAN GALERI LENGKAP & SEARCH/FILTER
- **Added**: Pembuatan halaman galeri prestasi komprehensif `prestasi.html`.
- **Added**: Fitur Realtime Instant Search di `prestasi.html` (pencarian nama siswa, lomba, dan penyelenggara).
- **Added**: Filter Pills Interaktif:
  - Berdasarkan Tingkat: `Semua`, `Provinsi & Nasional`, `Kota & Kecamatan`.
  - Berdasarkan Bidang: `Semua`, `Akademik & Sains`, `Seni & Kreativitas`, `Olahraga Prestasi`, `IPTEK & Robotika`.
- **Added**: Tombol Call to Action (CTA) `[ 🏆 Jelajahi Arsip Prestasi Lengkap → ]` di bawah slider Beranda `index.html`.
- **Added**: Tautan navigasi "Prestasi" pada navbar atas dan menu footer di semua halaman website.

---

### 6. ENGINE MASA AKTIF & PEMBERSIHAN OTOMATIS (TTL AUTO-PRUNE)
- **Added**: Penerapan aturan masa aktif (Time To Live / TTL) pada metadata JSON:
  - Tingkat Kecamatan & Kota (Juara 2, 3, Harapan): **3 Bulan**.
  - Tingkat Kecamatan & Kota (Juara 1): **6 Bulan**.
  - Tingkat Provinsi, Nasional, Internasional: **Abadi (Evergreen)**.
- **Added**: Fitur Client-Side Soft-Expiry (otomatis menyembunyikan kartu jika masa tayangnya telah habis).
- **Added**: Skrip pembersihan otomatis `scripts/cleanup-prestasi.js` yang memindai data kadaluarsa dan **menghapus file foto fisik dari folder `images/prestasi/`** untuk menjaga memori repositori tetap ramping.

---

### 7. TAHAP 3: BOT TELEGRAM & WORKFLOW PERSETUJUAN ADMIN
- **Added**: Pembangunan skrip Bot Telegram mandiri `scripts/bot.js` menggunakan native Node.js (tanpa dependensi berat pihak ketiga).
- **Security**: Penerapan proteksi kredensial rahasia (`TELEGRAM_BOT_TOKEN`, `ADMIN_CHAT_ID`) di dalam file `.env` yang diamankan oleh `.gitignore`.
- **Added**: Terverifikasi Admin Utama (Itock / Chat ID: `7187970534`).
- **Added**: Alur Persetujuan Admin (*Approval Workflow*):
  - Guru/staf mengirim laporan ke `@sdlab_prestasi_bot`.
  - Bot mengirim draf verifikasi ke Admin dengan tombol `[✅ Setujui & Tayangkan]` dan `[❌ Tolak]`.
  - Saat disetujui, bot otomatis mendownload foto resolusi tinggi, memperbarui `data/prestasi.json`, dan menjalankan `git commit & push` otomatis ke GitHub.

---

### 8. TAHAP 4: SMART FLEXIBLE PARSER (FORMAT BEBAS GURU & WA-STYLE)
- **Added**: Mesin parser cerdas berbasis Regex & NLP pada `scripts/bot.js` yang mampu mengenali format laporan WhatsApp santai guru dengan nomor urut (`1.`, `2.`, `3.`), bullet point, atau tanda pisah.
- **Added**: Auto-capitalization nama siswa dan normalisasi kelas.
- **Added**: Auto-Category Detection:
  - Kata kunci olahraga (*catur, renang, basket, lari, silat*) &rarr; `Olahraga Prestasi`.
  - Kata kunci seni (*vokal, tari, lukis, musik, band*) &rarr; `Seni & Kreativitas`.
  - Kata kunci sains (*osn, matematika, ipa, literasi*) &rarr; `Akademik & Sains`.
  - Kata kunci teknologi (*robot, coding, ai, komputer*) &rarr; `IPTEK & Robotika`.
- **Added**: Auto-Level & Masa Aktif:
  - Kata kunci *jawa tengah / jateng / prov* &rarr; Tingkat Provinsi (Masa aktif Abadi).
  - Kata kunci *salatiga / kota / kabupaten / ambarawa* &rarr; Tingkat Kota (3-6 Bulan).

---

### 9. TAHAP 5: FOTO UKURAN PENUH (LIGHTBOX MODAL) & PERBAIKAN CROPPING
- **Fixed**: Memperbaiki pemotongan wajah foto siswa (*head crop*) dengan menambahkan `object-position: top center;` dan memperbesar ketinggian wadah foto menjadi `height: 275px;` pada `css/style.css`.
- **Added**: Fitur Lightbox Modal Pop-up (`#modalDetailPrestasi`) saat kartu diklik:
  - Menampilkan foto ukuran penuh asli (Full HD tanpa terpotong).
  - Menampilkan kartu informasi detail ajang lomba.
- **Added**: Efek hover zoom hint icon di pojok kanan bawah foto kartu prestasi.

---

### 10. TAHAP 6: MANAJEMEN ID & FITUR HAPUS MANUAL VIA TELEGRAM
- **Changed**: Merapikan format ID prestasi menjadi bilangan bulat berurutan yang ringkas (`#1`, `#2`, `#3`, ..., `#6`).
- **Added**: Menu `/kelola` dan `/list` pada bot Telegram untuk Admin:
  - Menampilkan daftar prestasi aktif beserta tombol inline `[🗑️ Hapus #ID - Nama]`.
- **Security**: Tombol hapus dan perintah `/hapus <ID>` dilindungi khusus hanya bisa dijalankan oleh Admin terverifikasi.
- **Added**: Dialog konfirmasi keamanan anti-salah pencet: `[🚨 Ya, Hapus #ID]` dan `[❌ Batal]`.
- **Added**: Otomatisasi pembersihan foto fisik dari folder `images/prestasi/` dan sinkronisasi `git push` saat prestasi dihapus.

---

### 11. TAHAP 7: PENYESUAIAN METADATA LOMBA (TANGGAL, LOKASI & SUB-KATEGORI)
- **Added**: Menampilkan Tanggal Pelaksanaan Lomba (`competition_date`) dan Tempat Pelaksanaan (`location`) pada kartu depan di bawah nama lomba.
- **Changed**: Menyembunyikan Sub-Kategori Lomba dari kartu depan agar kartu tetap ringkas dan tidak sesak.
- **Added**: Menampilkan Sub-Kategori Khusus Ajang Lomba (contoh: *Juara Best Costume & Juara Umum 2*) secara lengkap di dalam jendela Modal Popup.
- **Changed**: Melengkapi tanggal pelaksanaan prestasi Isabella Leticia Aqueena & Leona Andara Suprapto menjadi **10 September 2026** (Lomba Dance Ajang GIHN UKSW di Kampus UKSW Salatiga).

---

### 12. TAHAP 8: DEPLOYMENT SERVER UBUNTU SEKOLAH & OTOMASI 24/7 (PM2 & AUTO-BOOT)
- **Added**: Deployment produksi sistem bot Telegram ke server fisik Ubuntu sekolah (`sdlabubuntuserver`) di lingkungan SD Kristen Satya Wacana / UKSW Salatiga (`/home/sdlab/websdlab`).
- **Added**: Konfigurasi Process Manager PM2 (`sdlab-prestasi-bot`) dalam mode daemon hening (*background process*) sehingga bot tetap aktif meskipun terminal/SSH ditutup.
- **Added**: Fitur Auto-Recovery & High Availability: Mendaftarkan PM2 ke daemon `systemd` via `pm2 startup` dan `pm2 save`, menjamin bot otomatis langsung hidup kembali setelah server restart atau pemadaman listrik.
- **Fixed**: Mengatasi kendala jaringan server Linux di ISP Indonesia di mana panggilan Telegram API menggantung (*hang*) pada rute IPv6, dengan mengonfigurasi `family: 4` (IPv4 murni) dan batas *timeout* 35 detik pada modul HTTP Node.js.
- **Added**: Pencatatan log aktivitas realtime pada `scripts/bot.js` (`[Telegram Update]`, `[Pesan Masuk]`, `[Laporan Valid]`) untuk kemudahan monitoring via `pm2 logs sdlab-prestasi-bot`.
- **Security**: Konfigurasi remote URL GitHub di server Ubuntu menggunakan Personal Access Token (PAT) resmi terotentikasi untuk eksekusi `git push origin main` otomatis saat persetujuan Admin.

---

### 13. TAHAP 9: SISTEM AUDIT LOG OTOMATIS & ACTIVITY TRAIL (TAMBAH/HAPUS/AUTO-PRUNE)
- **Added**: Modul pencatatan audit otomatis `scripts/audit-logger.js` (`recordActivity`).
- **Added**: Database log aktivitas JSON terstruktur di `data/activity_log.json`.
- **Added**: Buku Log Terbuka format Markdown di `docs/ACTIVITY_LOG.md` lengkap dengan ringkasan statistik dan tabel kronologis aksi.
- **Added**: Integrasi pencatatan otomatis pada alur persetujuan Admin (`TAMBAH`), penolakan draf (`TOLAK`), dan penghapusan mandiri via Telegram (`HAPUS`) di `scripts/bot.js`.
- **Added**: Integrasi pencatatan otomatis pada skrip retensi kadaluarsa (`AUTO_PRUNE`) di `scripts/cleanup-prestasi.js`.
- **Added**: Backfilling seluruh riwayat mutasi awal: prestasi #1 s.d #7 (termasuk #7 Damara Aqila Kiandra), pembaruan 26 personil GTK, koreksi konteks Kak Kempo, dan integrasi TikTok.
- **Added**: Sinkronisasi otomatis berkas log ke git commit dan push setiap kali ada penambahan atau penghapusan data.

---

### 14. TAHAP 10: AUDIT PENETRASI KEAMANAN & HARDENING SISTEM (SECURITY AUDIT)
- **Security**: Penyusunan dokumen audit keamanan resmi komprehensif di `docs/SECURITY_AUDIT.md`.
- **Fixed**: Mengatasi potensi *OS Command Injection* (CWE-78) pada `scripts/bot.js` dengan mengganti pemanggilan shell `execSync` menjadi `execFileSync` (parameter array murni tanpa pemanggilan shell) serta menambahkan filter sanitasi `sanitizeForCommit`.
- **Fixed**: Mengatasi potensi *Stored DOM Cross-Site Scripting (DOM XSS)* (CWE-79) pada `prestasi.html` dengan menambahkan fungsi sanitasi entitas `escapeHtml` sebelum data disuntikkan ke DOM.
- **Fixed**: Mengatasi potensi *Malformed HTML error* pada notifikasi Telegram dengan menerapkan `escapeTelegramHtml`.
- **Security**: Verifikasi riwayat Git (`git log -S`) mengonfirmasi 0 kebocoran kredensial rahasia (Token Telegram & PAT GitHub 100% aman).

---

### 15. TAHAP 11: TESTIMONI RESMI ORANG TUA SISWA (PAK JASSON)
- **Added**: Penambahan testimoni autentik dari **Pak Jasson (Orang Tua Siswa Kelas 4 & 6)** sebagai kartu testimoni pertama di carousel `index.html` dan `about.html`.
- **Added**: Penggunaan foto profil resmi `images/pak_Jasson.webp` dengan penyesuaian posisi wajah presisi (`background-position: center 20%;`).
- **Added**: Pernyataan kepuasan orang tua terhadap lingkungan belajar yang *happy*, mandiri, penguatan karakter, serta guru yang kreatif dan penuh kasih di SD Kristen Satya Wacana.
- **Added**: Pencatatan riwayat penambahan testimoni secara otomatis ke `docs/ACTIVITY_LOG.md` dan `data/activity_log.json`.

---

### 16. TAHAP 12: OPTIMASI KONTEN TESTIMONI AUTENTIK & AUTO-ADAPTIVE CAROUSEL
- **Removed**: Menghapus seluruh komentar palsu/generik bawaan template di `index.html` dan `about.html`.
- **Changed**: Memfokuskan tampilan testimoni hanya pada ulasan nyata dan kredibel dari Pak Jasson (Orang Tua Siswa Kelas 4 & 6).
- **Added**: Fitur *Smart Adaptive Carousel* pada `js/main.js`:
  - Jika item testimoni hanya berjumlah 1 (`testimonyCount === 1`), carousel otomatis berpusat di tengah tanpa duplikasi/glitch.
  - Begitu ada komentar ortu ke-2 dan ke-3 yang masuk nantinya (`testimonyCount > 1`), carousel otomatis mengaktifkan kembali rotasi geser berputar (*autoplay loop sliding*) secara mandiri tanpa perlu perubahan kode.
- **Added**: Pencatatan riwayat pembersihan di `docs/ACTIVITY_LOG.md` dan `data/activity_log.json`.

---

### 17. TAHAP 13: RESTORASI KARTU PENDAMPING TESTIMONI SEMENTARA
- **Changed**: Mengembalikan kartu testimoni pendamping di `index.html` dan `about.html` atas arahan pengguna agar slider carousel tetap terlihat penuh, variatif, dan bergerak dinamis (*multi-card autoplay loop*).
- **Changed**: Menempatkan testimoni autentik **Pak Jasson (Orang Tua Siswa Kelas 4 & 6)** sebagai kartu nomor 1 (posisi utama di depan).
- **Strategy**: Kartu-kartu pendamping ini akan digantikan secara bertahap begitu testimoni orang tua murid yang baru telah terkumpul dalam beberapa hari ke depan.
- **Added**: Pencatatan riwayat restorasi di `docs/ACTIVITY_LOG.md` dan `data/activity_log.json`.







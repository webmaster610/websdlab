# AI DEVELOPMENT RULES & GUIDELINES
## Proyek: Website SD Kristen Satya Wacana Salatiga (SD Lab UKSW)

---

### 1. IDENTITAS & KARAKTERISTIK SEKOLAH (KSP 2025/2026)
- **Nama Resmi**: SD Kristen Satya Wacana Salatiga (SD Lab UKSW).
- **Status & Akreditasi**: Terakreditasi "A" (Unggul). Sekolah Laboratorium di bawah naungan Universitas Kristen Satya Wacana (UKSW).
- **Alamat**: Jl. Yos Sudarso No. 1, Salatiga 50711, Jawa Tengah.
- **Kontak Resmi**:
  - Telepon: (0298) 323660
  - WhatsApp: 081390304093 (WA Only)
  - Email: sdlab.uksw@gmail.com
  - Instagram: @sdksatyawacana
  - TikTok: @sdkristen.satyawa
- **Visi Resmi**:
  *"Terwujudnya Peserta Didik yang Inovatif, Berkembang secara Holistik, dan Berwawasan Global dengan Kasih."*
- **Tagline Utama**:
  *"Membentuk Generasi Inovatif, Holistik, dan Berwawasan Global berdasarkan Kasih"*
- **Pilar & Keunggulan (UVP)**:
  1. *Sekolah Laboratorium UKSW*: Akses laboratorium FTI (Robotika, AI, Coding), FSM (Sains), FBS (Studio Bahasa), dan dosen tamu.
  2. *Kemitraan Global*: Kerja sama internasional dengan Kwansei Gakuin University, Jepang.
  3. *Deep Learning & Humanizing Education*: Pembelajaran bermakna (Meaningful), penuh kesadaran (Mindful), dan membahagiakan (Joyful).
  4. *Rapor Mutu Kemendikbudristek*: Indeks Literasi 81.76 (Sangat Tinggi / Baik), Iklim Keamanan & Toleransi Inklusif (Indonesia Mini).

---

### 2. STRICT CONSTRAINTS (ATURAN MUTLAK)

#### A. Bebas Tanggal pada Kegiatan (No Dates in Activities)
- **DILARANG KERAS** menyematkan tanggal, hari, bulan, dan tahun (misal: "17 Agustus 2026", "January 2019", dll.) pada seluruh kartu berita, kegiatan, dan galeri sekolah.
- Sebagai pengganti, gunakan **Badge Kategori Kegiatan Tematik**:
  - `Outdoor Learning` (Solo Safari, dll.)
  - `Outing Class` (Museum Sangiran, dll.)
  - `Edukasi Damkar` (Simulasi Keselamatan Kebakaran)
  - `Mitigasi Bencana` (Simulasi Tanggap Bencana BPBD)
  - `Panggung Dongeng` (Literasi Budi Pekerti bersama Kak Kempo)
  - `Prestasi Siswa` (Akademik & Olahraga)

#### B. Koreksi Konteks Tokoh: KAK KEMPO
- **"Kak Kempo" BUKAN cabang olahraga bela diri Shorinji Kempo**.
- Kak Kempo adalah **Aktivis Pendongeng Anak Nasional dari Kota Semarang** yang menghadirkan panggung dongeng inspiratif, penanaman budi pekerti, dan penguatan literasi anak di SD Kristen Satya Wacana.
- Foto dan liputan Kak Kempo wajib ditempatkan dalam kategori: **Panggung Dongeng & Penguatan Literasi Karakter**.

#### C. Penamaan Lomba Kemerdekaan
- Gunakan judul resmi yang bersih: **"Peringatan & Lomba Kemerdekaan Republik Indonesia di SD Kristen Satya Wacana"**.
- Dilarang menambahkan kata *"semarak"* atau *"pesta rakyat"*.

---

### 3. STANDAR DESAIN, WARNA & TIPOGRAFI (ANTI-TABRAKAN WARNA)

#### A. Aturan Kontras di Atas Latar Gelap (Foto/Hero/Counter)
- Background foto yang gelap atau sibuk **WAJIB** dilapisi *Dark Overlay* yang merata:
  `background: rgba(15, 23, 42, 0.85);`
- **Warna Teks**:
  - Judul / Heading: **Putih Bersih (`#ffffff`)** dengan bayangan tipis (`text-shadow: 0 2px 4px rgba(0,0,0,0.4)`).
  - Paragraf / Deskripsi: **Putih Lembut (`#e2e8f0` / `rgba(255,255,255,0.85)`)**.
  - Angka Statistik & Highlight: **Oranye-Emas Satya Wacana (`#fd5f00` / `#f59f00`)**.
  - Ikon: **Putih Bersih atau Emas**, DILARANG menggunakan warna hitam di atas latar gelap.

#### B. Aturan Kontras di Atas Latar Terang (Kartu & Konten)
- Judul: Navy Slate Gelap (`#1e293b`).
- Subjudul / Jabatan: Biru Satya Wacana (`#0d83ff` atau `#1eaaf1`).
- Paragraf: Slate Gray (`#475569`).

---

### 4. STANDAR STRUKTUR BOX & GRID (EQUAL HEIGHT CARDS)
- Seluruh box kartu pada:
  1. Kartu Profil Guru (`.staff`)
  2. Kartu Ekstrakurikuler (`.course`)
  3. Kartu Galeri Prestasi (`.pricing-entry`)
  4. Kartu Berita Kegiatan (`.blog-entry`)
- **WAJIB** memiliki tinggi yang seragam dan sejajar (Equal Height) di dalam satu baris:
  - Gunakan Flexbox container: `d-flex align-items-stretch`.
  - Kartu di dalamnya: `h-100 d-flex flex-column justify-content-between`.
  - Ukuran gambar thumbnail / foto guru dibuat proporsional dan tetap (`height: 280px; object-fit: cover;`).
  - Baris nama dan jabatan memiliki `min-height` agar teks paragraf deskripsi sejajar rapi.

---

### 5. PROTOKOL GIT & REPOSITORI
- **Author Lokal**: `webmaster <webmaster@sdlabuksw.sch.id>`.
- **Remote Repo**: `https://github.com/webmaster610/websdlab.git` (Branch: `main`).
- **Target Live**: `https://webmaster610.github.io/websdlab/`.
- **Safety Policy**: JANGAN PERNAH mengubah konfigurasi git global laptop (`git config --global`) agar akun proyek lain (seperti Prasasti) tidak terdampak. Selalu gunakan konfigurasi lokal per-repositori.

/**
 * BOT TELEGRAM OTOMATISASI PRESTASI SISWA (SMART NLP / FLEXIBLE PARSER)
 * SD KRISTEN SATYA WACANA SALATIGA (SD LAB UKSW)
 * 
 * Keunggulan:
 * 1. Mampu membaca format random/gaya WhatsApp dari guru & staf (nomor 1, 2, 3 dll)
 * 2. Smart Category Detection (Catur/Renang -> Olahraga, Vokal -> Seni, OSN -> Sains, Coding -> Robotika)
 * 3. Smart Level & TTL Detection (Jawa Tengah -> Provinsi/Abadi, Salatiga/Kota -> 3/6 Bulan)
 * 4. Otomatis sensor & abaikan tanggal pelaksanaan (menjaga aturan bebas tanggal)
 * 5. Auto capitalize nama siswa & format kelas
 * 6. Mengirim draf ke Admin dengan tombol [✅ Setujui & Tayangkan] / [❌ Tolak]
 * 7. Unduh foto, update data/prestasi.json, dan git push otomatis ke GitHub
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// 1. LOAD CONFIG DARI .ENV
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID ? String(process.env.ADMIN_CHAT_ID) : '';

if (!BOT_TOKEN) {
  console.error('FATAL: TELEGRAM_BOT_TOKEN belum diset di file .env');
  process.exit(1);
}

const DATA_FILE = path.join(__dirname, '..', 'data', 'prestasi.json');
const IMAGES_DIR = path.join(__dirname, '..', 'images', 'prestasi');
const PENDING_FILE = path.join(__dirname, '..', 'data', 'pending_submissions.json');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function getPendingSubmissions() {
  if (fs.existsSync(PENDING_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PENDING_FILE, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function savePendingSubmissions(data) {
  fs.writeFileSync(PENDING_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 2. TELEGRAM API HELPER
function callTelegram(method, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = https.request({
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve({ ok: false, error: data });
        }
      });
    });

    req.on('error', err => reject(err));
    req.write(postData);
    req.end();
  });
}

async function sendMessage(chatId, text, extra = {}) {
  return callTelegram('sendMessage', {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    ...extra
  });
}

async function sendPhoto(chatId, photo, caption, extra = {}) {
  return callTelegram('sendPhoto', {
    chat_id: chatId,
    photo: photo,
    caption: caption,
    parse_mode: 'HTML',
    ...extra
  });
}

async function editMessageText(chatId, messageId, text, extra = {}) {
  return callTelegram('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: 'HTML',
    ...extra
  });
}

async function editMessageCaption(chatId, messageId, caption, extra = {}) {
  return callTelegram('editMessageCaption', {
    chat_id: chatId,
    message_id: messageId,
    caption: caption,
    parse_mode: 'HTML',
    ...extra
  });
}

async function answerCallbackQuery(callbackQueryId, text, showAlert = false) {
  return callTelegram('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text: text,
    show_alert: showAlert
  });
}

// 3. DOWNLOAD PHOTO DARI TELEGRAM
async function downloadTelegramPhoto(fileId, targetRelativePath) {
  const fileInfo = await callTelegram('getFile', { file_id: fileId });
  if (!fileInfo.ok || !fileInfo.result.file_path) {
    throw new Error('Gagal mendapatkan file foto dari Telegram.');
  }

  const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.result.file_path}`;
  const targetFullPath = path.join(__dirname, '..', targetRelativePath);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(targetFullPath);
    https.get(fileUrl, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(targetRelativePath));
      });
    }).on('error', err => {
      fs.unlink(targetFullPath, () => {});
      reject(err);
    });
  });
}

// 4. SMART NORMALIZATION UTILS
function toTitleCase(str) {
  if (!str) return '';
  return str.replace(/\b\w+/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function normalizeClass(raw) {
  if (!raw) return 'Kelas Prestasi';
  let str = raw.trim();
  // Contoh: "6A", "6 A", "6", "VI A", "Kelas 6A"
  if (/^kelas/i.test(str)) {
    return toTitleCase(str);
  }
  return `Kelas ${str.toUpperCase()}`;
}

// 5. SMART FLEXIBLE PARSER (FORMAT RANDOM GURU / WA STYLE)
function smartParseReport(rawText) {
  if (!rawText) return null;

  const data = {
    student_name: '',
    student_class: '',
    competition: '',
    organizer: '',
    level: '',
    rank: '',
    category: ''
  };

  const lines = rawText.split('\n');

  lines.forEach(line => {
    let cleanLine = line.trim();
    if (!cleanLine) return;

    // Bersihkan nomor di depan baris: "1. ", "2. ", "a. ", "- ", "* "
    cleanLine = cleanLine.replace(/^([0-9]+[\.\)]|\-|\*|[a-zA-Z][\.\)])\s*/i, '').trim();

    // Pisahkan key & value berdasarkan ':'
    const colonIdx = cleanLine.indexOf(':');
    if (colonIdx !== -1) {
      const key = cleanLine.substring(0, colonIdx).trim().toLowerCase();
      const val = cleanLine.substring(colonIdx + 1).trim();

      if (!val) return;

      // 0. ABAIKAN WAKTU, TANGGAL & FOTO (Strict Rule: Bebas Tanggal)
      if (key.includes('waktu') || key.includes('tanggal') || key.includes('hari') || key.includes('jam') || key.includes('foto') || key.includes('lampir') || key.includes('dokumentasi')) {
        return;
      }

      // 1. NAMA SISWA
      if (key.includes('nama siswa') || key.includes('nama murid') || key.includes('nama anak') || key.includes('nama peserta') || key === 'nama') {
        data.student_name = toTitleCase(val);
      }
      // 2. KELAS
      else if (key.includes('kelas') || key.includes('kls')) {
        data.student_class = normalizeClass(val);
      }
      // 3. JUARA / PERINGKAT
      else if (key.includes('juara') || key.includes('peringkat') || key.includes('capaian') || key.includes('perolehan')) {
        data.rank = val;
      }
      // 4. TEMPAT / PENYELENGGARA (Cek sebelum lomba, misal: "tempat pelaksanaan lomba")
      else if (key.includes('penyelenggara') || key.includes('pelaksana') || key.includes('panitia') || key.includes('oleh') || key.includes('tempat') || key.includes('lokasi')) {
        data.organizer = toTitleCase(val);
      }
      // 5. KATEGORI / TINGKAT (Cek sebelum lomba, misal: "tingkat lomba")
      else if (key.includes('kategori') || key.includes('tingkat') || key.includes('lingkup') || key.includes('wilayah') || key.includes('skala')) {
        data.level = val;
      }
      // 6. NAMA LOMBA / AJANG
      else if (key.includes('nama ajang') || key.includes('ajang') || key.includes('nama lomba') || key.includes('kejuaraan') || key.includes('lomba') || key.includes('kompetisi') || key.includes('turnamen') || key.includes('event')) {
        data.competition = toTitleCase(val);
      }
    }
  });

  // JIKA TIDAK DITEMUKAN FORMAT TITIK DUA (:), CARI KATA KUNCI SECARA FLEKSIBEL
  const fullTextLower = rawText.toLowerCase();

  // Deteksi Tingkat (Level) Cerdas
  let detectedLevel = 'kota';
  if (fullTextLower.includes('jawa tengah') || fullTextLower.includes('jateng') || fullTextLower.includes('se jawa tengah') || fullTextLower.includes('provinsi')) {
    detectedLevel = 'provinsi';
  } else if (fullTextLower.includes('nasional') || fullTextLower.includes('se-indonesia') || fullTextLower.includes('se indonesia') || fullTextLower.includes('kejurnas')) {
    detectedLevel = 'nasional';
  } else if (fullTextLower.includes('internasional') || fullTextLower.includes('dunia') || fullTextLower.includes('global') || fullTextLower.includes('asia')) {
    detectedLevel = 'internasional';
  } else if (fullTextLower.includes('kecamatan') || fullTextLower.includes('korwil') || fullTextLower.includes('gugus')) {
    detectedLevel = 'kecamatan';
  } else if (fullTextLower.includes('salatiga') || fullTextLower.includes('kota') || fullTextLower.includes('kabupaten') || fullTextLower.includes('ambarawa') || fullTextLower.includes('kab')) {
    detectedLevel = 'kota';
  }
  if (!data.level) data.level = detectedLevel;

  // Deteksi Kategori Cerdas Berdasarkan Kata Kunci Lomba
  let detectedCategory = 'Akademik & Sains';
  let detectedCatKey = 'akademik';

  const sportWords = ['catur', 'renang', 'basket', 'lari', 'silat', 'taekwondo', 'futsal', 'sepak bola', 'bola', 'badminton', 'bulutangkis', 'atletik', 'senam', 'karate', 'sepatu roda', 'panahan', 'tenis', 'voli'];
  const artWords = ['vokal', 'nyanyi', 'solo vokal', 'tari', 'dance', 'lukis', 'gambar', 'mewarnai', 'musik', 'band', 'fls2n', 'biola', 'piano', 'puisi', 'dongeng', 'fashion', 'batik', 'seni'];
  const techWords = ['robot', 'robotika', 'coding', 'ai', 'komputer', 'scratch', 'stem', 'steam', 'lego', 'game', 'teknologi', 'iptek'];

  if (sportWords.some(w => fullTextLower.includes(w))) {
    detectedCategory = 'Olahraga Prestasi';
    detectedCatKey = 'olahraga';
  } else if (artWords.some(w => fullTextLower.includes(w))) {
    detectedCategory = 'Seni Vokal & Musik';
    detectedCatKey = 'seni';
  } else if (techWords.some(w => fullTextLower.includes(w))) {
    detectedCategory = 'IPTEK & Robotika';
    detectedCatKey = 'robotika';
  }

  data.category = detectedCategory;
  data.category_key = detectedCatKey;

  // Default Fallback
  if (!data.organizer) {
    data.organizer = `Panitia Pelaksana ${data.competition || 'Kompetisi'}`;
  }
  if (!data.student_class) {
    data.student_class = 'Siswa Prestasi';
  }
  if (!data.rank) {
    data.rank = '1';
  }

  return data;
}

// 6. HITUNG RETENSI & BADGE
function calculateRetentionAndBadge(level, rank) {
  let expiresAt = null;
  let badgeText = '';
  let badgeClass = 'badge-gold';

  const rankStr = String(rank).toLowerCase();
  const isHarapan = rankStr.includes('harapan');
  const isJuara1 = !isHarapan && (rankStr === '1' || rankStr.includes('1') || rankStr.includes('emas') || rankStr.includes('pertama'));
  const isJuara2 = !isHarapan && (rankStr === '2' || rankStr.includes('2') || rankStr.includes('perak') || rankStr.includes('kedua'));
  const isJuara3 = !isHarapan && (rankStr === '3' || rankStr.includes('3') || rankStr.includes('perunggu') || rankStr.includes('ketiga'));

  let rankLabel = 'Juara 1';
  if (isHarapan) {
    if (rankStr.includes('1') || rankStr.includes('satu')) rankLabel = 'Juara Harapan 1';
    else if (rankStr.includes('2') || rankStr.includes('dua')) rankLabel = 'Juara Harapan 2';
    else if (rankStr.includes('3') || rankStr.includes('tiga')) rankLabel = 'Juara Harapan 3';
    else rankLabel = 'Juara Harapan';
    badgeClass = 'badge-bronze';
  } else if (isJuara1) {
    rankLabel = 'Juara 1';
    badgeClass = 'badge-gold';
  } else if (isJuara2) {
    rankLabel = 'Juara 2';
    badgeClass = 'badge-silver';
  } else if (isJuara3) {
    rankLabel = 'Juara 3';
    badgeClass = 'badge-bronze';
  } else {
    rankLabel = 'Juara Prestasi';
    badgeClass = 'badge-bronze';
  }

  let levelLabel = 'Tingkat Kota';
  const lvl = (level || '').toLowerCase();
  if (lvl.includes('kecamatan') || lvl.includes('korwil')) {
    levelLabel = 'Tingkat Kecamatan';
  } else if (lvl.includes('prov') || lvl.includes('jateng') || lvl.includes('jawa tengah') || lvl.includes('diy') || lvl.includes('daerah')) {
    levelLabel = 'Tingkat Provinsi';
    badgeClass = isJuara1 ? 'badge-gold' : (isHarapan ? 'badge-bronze' : 'badge-blue');
  } else if (lvl.includes('nasional') || lvl.includes('indonesia')) {
    levelLabel = 'Tingkat Nasional';
    badgeClass = 'badge-gold';
  } else if (lvl.includes('internasional') || lvl.includes('global') || lvl.includes('dunia')) {
    levelLabel = 'Internasional';
    badgeClass = 'badge-gold';
  } else {
    levelLabel = 'Tingkat Kota';
  }

  badgeText = `${rankLabel} • ${levelLabel}`;

  // Hitung Masa Aktif
  const now = new Date();
  if (lvl.includes('prov') || lvl.includes('jateng') || lvl.includes('jawa tengah') || lvl.includes('diy') || lvl.includes('nasional') || lvl.includes('internasional')) {
    // Abadi / Evergreen
    expiresAt = null;
  } else {
    // Kecamatan / Kota
    const months = isJuara1 ? 6 : 3;
    const exp = new Date(now);
    exp.setMonth(exp.getMonth() + months);
    expiresAt = exp.toISOString().split('T')[0];
  }

  return { expiresAt, badgeText, badgeClass, isJuara1 };
}

// 7. SUBMISSION HANDLER
async function processSubmission(parsedData, photoFileId, senderChatId, senderName) {
  const subId = 'sub_' + Date.now();
  const pending = getPendingSubmissions();

  parsedData.id = subId;
  parsedData.photo_file_id = photoFileId;
  parsedData.senderChatId = senderChatId;
  parsedData.senderName = senderName;
  parsedData.submitted_at = new Date().toISOString();

  // Hitung TTL & Badge
  const meta = calculateRetentionAndBadge(parsedData.level, parsedData.rank);
  parsedData.badge = meta.badgeText;
  parsedData.badge_class = meta.badgeClass;
  parsedData.expires_at = meta.expiresAt;
  parsedData.created_at = new Date().toISOString().split('T')[0];

  pending[subId] = parsedData;
  savePendingSubmissions(pending);

  // Buat Kartu Pratinjau untuk Admin
  const captionAdmin = `
📋 <b>PENGAJUAN PRESTASI DITERIMA (VERIFIKASI ADMIN)</b>
Pengirim: <b>${senderName}</b>

🎓 <b>Siswa:</b> ${parsedData.student_name} (${parsedData.student_class})
🏅 <b>Capaian:</b> ${parsedData.badge}
🏆 <b>Lomba:</b> ${parsedData.competition}
🏛️ <b>Penyelenggara:</b> ${parsedData.organizer}
🏷️ <b>Kategori:</b> ${parsedData.category}
⏳ <b>Masa Aktif:</b> ${parsedData.expires_at ? `Aktif s.d ${parsedData.expires_at} (Auto-Prune)` : '<b>Abadi (Evergreen - Tingkat Provinsi)</b>'}

Mohon konfirmasi untuk penayangan di website:
`.trim();

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '✅ Setujui & Tayangkan', callback_data: `approve:${subId}` },
        { text: '❌ Tolak', callback_data: `reject:${subId}` }
      ]
    ]
  };

  // Kirim ke Admin
  if (ADMIN_CHAT_ID) {
    if (parsedData.photo_file_id) {
      await sendPhoto(ADMIN_CHAT_ID, parsedData.photo_file_id, captionAdmin, {
        reply_markup: inlineKeyboard
      });
    } else {
      await sendMessage(ADMIN_CHAT_ID, captionAdmin, {
        reply_markup: inlineKeyboard
      });
    }
  }

  // Konfirmasi ke Pengirim
  await sendMessage(senderChatId, `
✅ <b>Laporan prestasi diterima!</b>
Data atas nama <b>${parsedData.student_name}</b> telah otomatis dirapikan dan diteruskan ke Admin untuk persetujuan tayang di website.

Terima kasih atas dedikasi dan kabarnya! 🙏
`.trim());
}

// 8. APPROVAL HANDLER (ADMIN KLIK SETUJUI)
async function handleApproval(subId, adminChatId, messageId, callbackQueryId) {
  const pending = getPendingSubmissions();
  const sub = pending[subId];

  if (!sub) {
    await answerCallbackQuery(callbackQueryId, 'Draf prestasi ini sudah diproses.', true);
    return;
  }

  await answerCallbackQuery(callbackQueryId, 'Memproses & mengunggah ke website...');

  try {
    // 1. Simpan Foto
    let imagePath = 'images/prestasi_piala_1.webp';
    if (sub.photo_file_id) {
      const fileName = `prestasi_${Date.now()}.jpg`;
      const relativePath = `images/prestasi/${fileName}`;
      await downloadTelegramPhoto(sub.photo_file_id, relativePath);
      imagePath = relativePath;
    }

    // 2. Baca data/prestasi.json
    let list = [];
    if (fs.existsSync(DATA_FILE)) {
      list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    // 3. Tambahkan ke Daftar Prestasi (Sequential Clean ID)
    const existingIds = list.map(item => Number(item.id) || 0);
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    const newEntry = {
      id: nextId,
      title: `${sub.badge} - ${sub.competition}`,
      badge: sub.badge,
      badge_class: sub.badge_class,
      student_name: sub.student_name,
      student_class: sub.student_class,
      competition: sub.competition,
      organizer: sub.organizer,
      category: sub.category,
      category_key: sub.category_key,
      level: sub.level || 'kota',
      rank: sub.rank || 1,
      created_at: sub.created_at,
      expires_at: sub.expires_at,
      image: imagePath,
      featured: true
    };

    list.unshift(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');

    // 4. Git Push Otomatis
    try {
      execSync('git config --local user.name "webmaster"', { cwd: path.join(__dirname, '..') });
      execSync('git config --local user.email "webmaster@sdlabuksw.sch.id"', { cwd: path.join(__dirname, '..') });
      execSync('git add data/prestasi.json images/prestasi/', { cwd: path.join(__dirname, '..') });
      execSync(`git commit -m "feat(prestasi): tayangkan prestasi ${sub.student_name} [skip ci]"`, { cwd: path.join(__dirname, '..') });
      execSync('git push origin main', { cwd: path.join(__dirname, '..') });
      console.log(`[Git Push Success] Prestasi ${sub.student_name} berhasil tayang di GitHub!`);
    } catch (gitErr) {
      console.error('[Git Commit/Push Warning]:', gitErr.message);
    }

    delete pending[subId];
    savePendingSubmissions(pending);

    // 5. Update Status di HP Admin
    const successCaption = `
🎉 <b>PRESTASI TELAH DISETUJUI & TAYANG DI WEBSITE!</b>

🎓 <b>Siswa:</b> ${sub.student_name} (${sub.student_class})
🏅 <b>Capaian:</b> ${sub.badge}
🏆 <b>Lomba:</b> ${sub.competition}
🏛️ <b>Penyelenggara:</b> ${sub.organizer}
⏳ <b>Masa Aktif:</b> ${sub.expires_at ? `Aktif s.d ${sub.expires_at}` : '<b>Abadi (Evergreen)</b>'}
🌐 <b>Status:</b> Live di https://webmaster610.github.io/websdlab/prestasi.html
`.trim();

    if (sub.photo_file_id) {
      await editMessageCaption(adminChatId, messageId, successCaption, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 Buka Galeri Prestasi Website', url: 'https://webmaster610.github.io/websdlab/prestasi.html' }]
          ]
        }
      });
    } else {
      await editMessageText(adminChatId, messageId, successCaption, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 Buka Galeri Prestasi Website', url: 'https://webmaster610.github.io/websdlab/prestasi.html' }]
          ]
        }
      });
    }

    // 6. Notifikasi ke Pengirim
    if (sub.senderChatId) {
      await sendMessage(sub.senderChatId, `
🎉 <b>Kabar Gembira!</b>
Prestasi <b>${sub.student_name}</b> dalam ajang <i>${sub.competition}</i> telah <b>DISETUJUI</b> oleh Admin dan kini sudah resmi tayang di website sekolah! 🏆

🔗 Lihat di sini: https://webmaster610.github.io/websdlab/prestasi.html
`.trim());
    }

  } catch (err) {
    console.error('Error in handleApproval:', err);
    await sendMessage(adminChatId, `⚠️ Terjadi kendala: ${err.message}`);
  }
}

// 9. REJECT HANDLER
async function handleRejection(subId, adminChatId, messageId, callbackQueryId) {
  const pending = getPendingSubmissions();
  const sub = pending[subId];

  if (!sub) {
    await answerCallbackQuery(callbackQueryId, 'Draf ini sudah tidak ada.', true);
    return;
  }

  delete pending[subId];
  savePendingSubmissions(pending);

  await answerCallbackQuery(callbackQueryId, 'Pengajuan prestasi telah ditolak.');

  const rejectText = `❌ <b>PENGAJUAN PRESTASI DITOLAK</b>\n\nSiswa: ${sub.student_name}\nLomba: ${sub.competition}\nStatus: Tidak ditayangkan ke website.`;

  if (sub.photo_file_id) {
    await editMessageCaption(adminChatId, messageId, rejectText);
  } else {
    await editMessageText(adminChatId, messageId, rejectText);
  }

  if (sub.senderChatId) {
    await sendMessage(sub.senderChatId, `
ℹ️ <b>Pemberitahuan:</b>
Mohon maaf, pengajuan prestasi untuk <b>${sub.student_name}</b> (${sub.competition}) belum disetujui untuk ditayangkan ke website saat ini.
`.trim());
  }
}

// 9.5 MANUAL DELETE & KELOLA HANDLERS
async function handleDeletePrompt(targetId, adminChatId, callbackQueryId) {
  if (!fs.existsSync(DATA_FILE)) return;
  const list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const item = list.find(p => String(p.id) === String(targetId));

  if (!item) {
    if (callbackQueryId) await answerCallbackQuery(callbackQueryId, 'Prestasi dengan ID tersebut tidak ditemukan.', true);
    return;
  }

  if (callbackQueryId) await answerCallbackQuery(callbackQueryId);

  const confirmMsg = `
⚠️ <b>KONFIRMASI HAPUS PRESTASI</b>

Apakah Anda yakin ingin menghapus prestasi berikut:
🆔 <b>ID: #${item.id}</b>
🎓 <b>Siswa:</b> ${item.student_name} (${item.student_class})
🏅 <b>Capaian:</b> ${item.badge}
🏆 <b>Lomba:</b> ${item.competition}

Data dan foto fisik akan dihapus secara permanen dari website.
`.trim();

  await sendMessage(adminChatId, confirmMsg, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: `🚨 Ya, Hapus #${item.id}`, callback_data: `confirm_delete:${item.id}` },
          { text: '❌ Batal', callback_data: 'cancel_delete' }
        ]
      ]
    }
  });
}

async function handleConfirmDelete(targetId, adminChatId, messageId, callbackQueryId) {
  if (!fs.existsSync(DATA_FILE)) return;
  let list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const item = list.find(p => String(p.id) === String(targetId));

  if (!item) {
    await answerCallbackQuery(callbackQueryId, 'Prestasi ini sudah tidak ada.', true);
    return;
  }

  await answerCallbackQuery(callbackQueryId, 'Menghapus dari website...');

  // 1. Hapus Foto dari images/prestasi/ jika ada
  if (item.image && item.image.startsWith('images/prestasi/')) {
    const fullImgPath = path.join(__dirname, '..', item.image);
    if (fs.existsSync(fullImgPath)) {
      try {
        fs.unlinkSync(fullImgPath);
        console.log(`[Storage Deleted] Foto terhapus: ${item.image}`);
      } catch (e) {
        console.error('Gagal hapus foto:', e.message);
      }
    }
  }

  // 2. Hapus entri dari data/prestasi.json
  list = list.filter(p => String(p.id) !== String(targetId));
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');

  // 3. Git commit & push otomatis
  try {
    execSync('git config --local user.name "webmaster"', { cwd: path.join(__dirname, '..') });
    execSync('git config --local user.email "webmaster@sdlabuksw.sch.id"', { cwd: path.join(__dirname, '..') });
    execSync('git add data/prestasi.json images/prestasi/', { cwd: path.join(__dirname, '..') });
    execSync(`git commit -m "chore(prestasi): hapus prestasi #${item.id} (${item.student_name}) [skip ci]"`, { cwd: path.join(__dirname, '..') });
    execSync('git push origin main', { cwd: path.join(__dirname, '..') });
    console.log(`[Git Delete Success] Prestasi #${item.id} berhasil dihapus dari GitHub!`);
  } catch (gitErr) {
    console.error('[Git Delete Warning]:', gitErr.message);
  }

  // 4. Update status pesan
  const deletedText = `
🗑️ <b>PRESTASI BERHASIL DIHAPUS</b>

ID: <b>#${item.id}</b>
Siswa: <b>${item.student_name}</b>
Lomba: <i>${item.competition}</i>

Status: <i>Data dan foto telah dibersihkan dari website.</i>
`.trim();

  await editMessageText(adminChatId, messageId, deletedText);
}

// 10. MAIN LONG-POLLING ENGINE
let lastUpdateId = 0;

async function pollUpdates() {
  try {
    const res = await callTelegram('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 25
    });

    if (res.ok && res.result && res.result.length > 0) {
      for (const update of res.result) {
        lastUpdateId = update.update_id;

        // Callback Query (Admin klik tombol)
        if (update.callback_query) {
          const cb = update.callback_query;
          const data = cb.data || '';
          const adminId = String(cb.from.id);

          if (adminId !== ADMIN_CHAT_ID) {
            await answerCallbackQuery(cb.id, 'Hanya Admin yang berwenang menekan tombol ini.', true);
            continue;
          }

          if (data.startsWith('approve:')) {
            const subId = data.replace('approve:', '');
            await handleApproval(subId, cb.message.chat.id, cb.message.message_id, cb.id);
          } else if (data.startsWith('reject:')) {
            const subId = data.replace('reject:', '');
            await handleRejection(subId, cb.message.chat.id, cb.message.message_id, cb.id);
          } else if (data.startsWith('delete_prompt:')) {
            const targetId = data.replace('delete_prompt:', '');
            await handleDeletePrompt(targetId, cb.message.chat.id, cb.id);
          } else if (data.startsWith('confirm_delete:')) {
            const targetId = data.replace('confirm_delete:', '');
            await handleConfirmDelete(targetId, cb.message.chat.id, cb.message.message_id, cb.id);
          } else if (data === 'cancel_delete') {
            await editMessageText(cb.message.chat.id, cb.message.message_id, 'ℹ️ Penghapusan dibatalkan. Data tetap aman.');
            await answerCallbackQuery(cb.id, 'Dibatalkan.');
          }
          continue;
        }

        // Pesan Masuk
        if (update.message) {
          const msg = update.message;
          const chatId = msg.chat.id;
          const text = msg.text || msg.caption || '';
          const from = msg.from || {};
          const photo = msg.photo;

          // Perintah Dasar
          if (text.startsWith('/start') || text.startsWith('/help')) {
            const isAdmin = String(chatId) === ADMIN_CHAT_ID;
            let helpText = `
👋 <b>Halo, ${from.first_name || 'Bapak/Ibu'}!</b>
Selamat datang di <b>Bot Prestasi SD Kristen Satya Wacana (SD Lab UKSW)</b>.

Bapak/Ibu Guru dan Staf dapat melaporkan prestasi siswa dengan santai cukup dengan mengirimkan <b>FOTO</b> (anak/piala/piagam) disertai keterangan teks gaya WhatsApp seperti biasa.

<b>Contoh format bebas yang bisa langsung dikirim:</b>
<code>melaporkan perolehan prestasi siswa
1. Nama siswa: Kaleb Deven Kristyanto
2. Kelas: 6A
3. Juara: 2
4. Nama ajang lomba: Kejuaraan Catur Museum Ambarawa Cup 1
5. Tempat: Pendopo Kantor Kecamatan Ambarawa
6. Kategori: Tingkat SD Se-Jawa Tengah
7. Foto terlampir</code>

Sistem cerdas bot akan otomatis merapikan data dan meneruskannya ke Admin untuk persetujuan tayang di website! 🏆
`;
            if (isAdmin) {
              helpText += `
\n👑 <b>Menu Khusus Admin:</b>
• <b>/kelola</b> : Kelola & Hapus prestasi aktif via tombol
• <b>/list</b> : Daftar ringkas prestasi aktif
• <b>/hapus &lt;ID&gt;</b> : Hapus prestasi berdasar ID (contoh: /hapus 6)
• <b>/cleanup</b> : Pembersihan prestasi kadaluarsa (auto-prune)
`;
            }
            await sendMessage(chatId, helpText.trim());
            continue;
          }

          if (text.startsWith('/kelola') || text.startsWith('/list')) {
            if (!fs.existsSync(DATA_FILE)) {
              await sendMessage(chatId, 'Belum ada data prestasi.');
              continue;
            }
            const list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            const isAdmin = String(chatId) === ADMIN_CHAT_ID;

            if (isAdmin) {
              let out = `👑 <b>PANEL KELOLA PRESTASI WEBSITE</b>\n\n`;
              out += `Pilih tombol <b>[🗑️ Hapus]</b> pada prestasi yang ingin Anda hapus:\n\n`;

              const inlineKeyboard = [];
              list.forEach(p => {
                out += `🆔 <b>[ID #${p.id}] ${p.student_name}</b> (${p.student_class})\n`;
                out += `🏅 ${p.badge}\n`;
                out += `🏆 ${p.competition}\n\n`;

                inlineKeyboard.push([
                  { text: `🗑️ Hapus #${p.id} - ${p.student_name.split(' ')[0]}`, callback_data: `delete_prompt:${p.id}` }
                ]);
              });

              out += `🌐 webmaster610.github.io/websdlab/prestasi.html`;

              await sendMessage(chatId, out, {
                reply_markup: { inline_keyboard: inlineKeyboard }
              });
            } else {
              let out = `🏆 <b>Daftar Prestasi Aktif di Website:</b>\n\n`;
              list.slice(0, 5).forEach((p, i) => {
                out += `${i + 1}. <b>${p.student_name}</b> (${p.student_class})\n   ${p.badge}\n   Lomba: ${p.competition}\n\n`;
              });
              out += `🌐 webmaster610.github.io/websdlab/prestasi.html`;
              await sendMessage(chatId, out);
            }
            continue;
          }

          if (text.startsWith('/hapus')) {
            if (String(chatId) !== ADMIN_CHAT_ID) {
              await sendMessage(chatId, 'Hanya Admin yang dapat menjalankan perintah ini.');
              continue;
            }
            const parts = text.split(' ');
            const targetId = parts[1] ? parts[1].replace('#', '').trim() : '';
            if (!targetId) {
              await sendMessage(chatId, '⚠️ Silakan sertakan ID prestasi. Contoh: <code>/hapus 6</code>\nKetik <b>/kelola</b> untuk melihat daftar ID.');
            } else {
              await handleDeletePrompt(targetId, chatId);
            }
            continue;
          }

          if (text.startsWith('/cleanup')) {
            if (String(chatId) !== ADMIN_CHAT_ID) {
              await sendMessage(chatId, 'Hanya Admin yang dapat menjalankan perintah ini.');
              continue;
            }
            await sendMessage(chatId, '🧹 <i>Menjalankan pembersihan prestasi kadaluarsa...</i>');
            try {
              execSync('node scripts/cleanup-prestasi.js', { cwd: path.join(__dirname, '..') });
              await sendMessage(chatId, '✅ Pembersihan selesai! Data dan memori foto telah dirapikan.');
            } catch (e) {
              await sendMessage(chatId, `⚠️ Kendala cleanup: ${e.message}`);
            }
            continue;
          }

          // DETEKSI LAPORAN PRESTASI (Bisa dengan Foto atau Teks Saja)
          const lower = text.toLowerCase();
          const isReport = lower.includes('nama') || lower.includes('siswa') || lower.includes('juara') || lower.includes('lomba') || lower.includes('prestasi');

          if (isReport) {
            const parsed = smartParseReport(text);
            let photoFileId = null;

            if (photo && photo.length > 0) {
              photoFileId = photo[photo.length - 1].file_id;
            }

            if (!parsed.student_name || !parsed.competition) {
              await sendMessage(chatId, '⚠️ Mohon pastikan dalam pesan terdapat <b>Nama Siswa</b> dan <b>Nama Lomba</b>.');
            } else {
              await processSubmission(parsed, photoFileId, chatId, from.first_name || 'Bapak/Ibu');
            }
            continue;
          }
        }
      }
    }
  } catch (err) {
    console.error('Polling error:', err.message);
  }

  setTimeout(pollUpdates, 1000);
}

console.log('====================================================');
console.log('🤖 SMART BOT PRESTASI SD SATYA WACANA TELAH DIAKTIFKAN');
console.log(`Admin Chat ID: ${ADMIN_CHAT_ID}`);
console.log('Mendukung format bebas guru, WhatsApp style, & Auto NLP');
console.log('====================================================');

pollUpdates();

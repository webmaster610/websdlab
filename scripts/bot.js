/**
 * BOT TELEGRAM OTOMATISASI PRESTASI SISWA
 * SD KRISTEN SATYA WACANA SALATIGA (SD LAB UKSW)
 * 
 * Fitur:
 * 1. Menerima kiriman foto & data juara dari Guru/Staf
 * 2. Mengirimkan draf verifikasi ke Admin dengan tombol [✅ Setujui] / [❌ Tolak]
 * 3. Menghitung otomatis masa aktif (TTL) sesuai aturan:
 *    - Kecamatan/Kota Juara 1: 6 Bulan
 *    - Kecamatan/Kota selain Juara 1: 3 Bulan
 *    - Provinsi/Nasional: Abadi (Evergreen)
 * 4. Otomatis simpan foto ke images/prestasi/, update data/prestasi.json, dan git push ke GitHub
 * 5. Perintah /cleanup untuk pembersihan prestasi kadaluarsa secara instan
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
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

// In-memory sessions untuk percakapan wizard step-by-step
const userSessions = {};

// Load Pending Submissions
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

// 3. DOWNLOAD FILE DARI TELEGRAM
async function downloadTelegramPhoto(fileId, targetRelativePath) {
  const fileInfo = await callTelegram('getFile', { file_id: fileId });
  if (!fileInfo.ok || !fileInfo.result.file_path) {
    throw new Error('Gagal mendapatkan path file foto dari Telegram.');
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

// 4. LOGIKA RETENSI & METADATA PRESTASI
function calculateRetentionAndBadge(level, rank) {
  let expiresAt = null;
  let badgeText = '';
  let badgeClass = 'badge-gold';

  const rankStr = String(rank).toLowerCase();
  const isJuara1 = rankStr === '1' || rankStr.includes('1') || rankStr.includes('emas') || rankStr.includes('pertama');
  const isJuara2 = rankStr === '2' || rankStr.includes('2') || rankStr.includes('perak') || rankStr.includes('kedua');
  const isJuara3 = rankStr === '3' || rankStr.includes('3') || rankStr.includes('perunggu') || rankStr.includes('ketiga');

  // Format Nama Badge
  let rankLabel = 'Juara 1';
  if (isJuara1) {
    rankLabel = 'Juara 1';
    badgeClass = 'badge-gold';
  } else if (isJuara2) {
    rankLabel = 'Juara 2';
    badgeClass = 'badge-silver';
  } else if (isJuara3) {
    rankLabel = 'Juara 3';
    badgeClass = 'badge-bronze';
  } else {
    rankLabel = 'Juara Harapan';
    badgeClass = 'badge-bronze';
  }

  let levelLabel = 'Tingkat Kota';
  const lvl = level.toLowerCase();
  if (lvl.includes('kecamatan')) {
    levelLabel = 'Tingkat Kecamatan';
  } else if (lvl.includes('kota') || lvl.includes('kabupaten')) {
    levelLabel = 'Tingkat Kota';
  } else if (lvl.includes('provinsi') || lvl.includes('jateng')) {
    levelLabel = 'Tingkat Provinsi';
    badgeClass = badgeClass === 'badge-gold' ? 'badge-gold' : 'badge-blue';
  } else if (lvl.includes('nasional')) {
    levelLabel = 'Tingkat Nasional';
    badgeClass = 'badge-gold';
  } else if (lvl.includes('internasional')) {
    levelLabel = 'Internasional';
    badgeClass = 'badge-gold';
  }

  badgeText = `${rankLabel} • ${levelLabel}`;

  // Hitung Masa Aktif (TTL)
  const now = new Date();
  if (lvl.includes('kecamatan') || lvl.includes('kota') || lvl.includes('kabupaten')) {
    const months = isJuara1 ? 6 : 3;
    const exp = new Date(now);
    exp.setMonth(exp.getMonth() + months);
    expiresAt = exp.toISOString().split('T')[0];
  } else {
    // Provinsi, Nasional, Internasional: Evergreen (Abadi)
    expiresAt = null;
  }

  return { expiresAt, badgeText, badgeClass, isJuara1 };
}

// 5. PARSER CAPTION / FORMAT TEKS CEPAT
function parseCaptionToPrestasi(text) {
  const lines = text.split('\n');
  const data = {};

  lines.forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim().toLowerCase();
      const val = parts.slice(1).join(':').trim();

      if (key.includes('nama') || key.includes('siswa')) data.student_name = val;
      else if (key.includes('kelas')) data.student_class = val;
      else if (key.includes('lomba') || key.includes('kompetisi') || key.includes('event')) data.competition = val;
      else if (key.includes('penyelenggara') || key.includes('oleh')) data.organizer = val;
      else if (key.includes('tingkat') || key.includes('level')) data.level = val;
      else if (key.includes('juara') || key.includes('peringkat') || key.includes('capaian')) data.rank = val;
      else if (key.includes('kategori') || key.includes('rumpun') || key.includes('bidang')) data.category = val;
    }
  });

  return data;
}

// 6. PROSES SUBMISSION BARU & KIRIM DRAF KE ADMIN
async function handleNewSubmission(submission, senderChatId, senderName) {
  const subId = 'sub_' + Date.now();
  const pending = getPendingSubmissions();

  submission.id = subId;
  submission.senderChatId = senderChatId;
  submission.senderName = senderName;
  submission.submitted_at = new Date().toISOString();

  // Hitung TTL & Badge
  const meta = calculateRetentionAndBadge(submission.level || 'kota', submission.rank || '1');
  submission.badge = meta.badgeText;
  submission.badge_class = meta.badgeClass;
  submission.expires_at = meta.expiresAt;
  submission.created_at = new Date().toISOString().split('T')[0];

  // Standarisasi Category
  let catLabel = 'Akademik & Sains';
  let catKey = 'akademik';
  const c = (submission.category || '').toLowerCase();
  if (c.includes('seni') || c.includes('musik') || c.includes('tari') || c.includes('gambar')) {
    catLabel = 'Seni Vokal & Musik';
    catKey = 'seni';
  } else if (c.includes('olahraga') || c.includes('renang') || c.includes('basket') || c.includes('catur') || c.includes('atletik')) {
    catLabel = 'Olahraga Prestasi';
    catKey = 'olahraga';
  } else if (c.includes('robot') || c.includes('coding') || c.includes('it') || c.includes('iptek')) {
    catLabel = 'IPTEK & Robotika';
    catKey = 'robotika';
  }
  submission.category = catLabel;
  submission.category_key = catKey;

  pending[subId] = submission;
  savePendingSubmissions(pending);

  // Buat Tampilan Draf untuk Admin
  const captionAdmin = `
📋 <b>PENGAJUAN PRESTASI BARU DARI GURU/STAF</b>
Pengirim: <b>${senderName}</b>

🎓 <b>Siswa:</b> ${submission.student_name} (${submission.student_class})
🏅 <b>Capaian:</b> ${submission.badge}
🏆 <b>Lomba:</b> ${submission.competition}
🏛️ <b>Penyelenggara:</b> ${submission.organizer}
🏷️ <b>Kategori:</b> ${submission.category}
⏳ <b>Masa Aktif:</b> ${submission.expires_at ? `Sampai ${submission.expires_at} (Auto-Prune)` : '<b>Abadi (Evergreen)</b>'}

Mohon verifikasi untuk penayangan di website:
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
    if (submission.photo_file_id) {
      await sendPhoto(ADMIN_CHAT_ID, submission.photo_file_id, captionAdmin, {
        reply_markup: inlineKeyboard
      });
    } else {
      await sendMessage(ADMIN_CHAT_ID, captionAdmin, {
        reply_markup: inlineKeyboard
      });
    }
  }

  // Notifikasi ke Pengirim
  await sendMessage(senderChatId, `
✅ <b>Terima kasih, ${senderName}!</b>
Data prestasi <b>${submission.student_name}</b> telah kami terima dan diteruskan ke Admin untuk diverifikasi.

Status Anda akan otomatis diinfokan di sini begitu disetujui. 🙏
`.trim());
}

// 7. APPROVAL HANDLER (SAAT ADMIN KLIK TOMBOL)
async function handleApproval(subId, adminChatId, messageId, callbackQueryId) {
  const pending = getPendingSubmissions();
  const sub = pending[subId];

  if (!sub) {
    await answerCallbackQuery(callbackQueryId, 'Draf prestasi ini sudah diproses sebelumnya.', true);
    return;
  }

  await answerCallbackQuery(callbackQueryId, 'Sedang memproses dan mengunggah ke website...');

  try {
    // 1. Simpan Foto ke folder images/prestasi/
    let imagePath = 'images/prestasi_piala_1.webp'; // Fallback
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

    // 3. Buat Entri Baru
    const newEntry = {
      id: Date.now(),
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

    // Tambahkan di awal daftar (paling baru muncul pertama)
    list.unshift(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');

    // 4. Git Commit & Push Otomatis
    try {
      execSync('git config --local user.name "webmaster"', { cwd: path.join(__dirname, '..') });
      execSync('git config --local user.email "webmaster@sdlabuksw.sch.id"', { cwd: path.join(__dirname, '..') });
      execSync('git add data/prestasi.json images/prestasi/', { cwd: path.join(__dirname, '..') });
      execSync(`git commit -m "feat(prestasi): tayangkan prestasi ${sub.student_name} via bot [skip ci]"`, { cwd: path.join(__dirname, '..') });
      execSync('git push origin main', { cwd: path.join(__dirname, '..') });
      console.log(`[Git Push Success] Prestasi ${sub.student_name} berhasil di-push ke GitHub!`);
    } catch (gitErr) {
      console.error('[Git Commit/Push Warning]:', gitErr.message);
    }

    // 5. Hapus dari Pending
    delete pending[subId];
    savePendingSubmissions(pending);

    // 6. Update Pesan di Chat Admin
    const successCaption = `
🎉 <b>PRESTASI TELAH DISETUJUI & TAYANG DI WEBSITE!</b>

🎓 <b>Siswa:</b> ${sub.student_name} (${sub.student_class})
🏅 <b>Capaian:</b> ${sub.badge}
🏆 <b>Lomba:</b> ${sub.competition}
🏛️ <b>Penyelenggara:</b> ${sub.organizer}
⏳ <b>Masa Aktif:</b> ${sub.expires_at ? `Aktif s.d ${sub.expires_at}` : 'Abadi'}
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

    // 7. Notifikasi ke Pengirim
    if (sub.senderChatId) {
      await sendMessage(sub.senderChatId, `
🎉 <b>Kabar Gembira!</b>
Pengajuan prestasi <b>${sub.student_name}</b> dalam ajang <i>${sub.competition}</i> telah <b>DISETUJUI</b> oleh Admin dan sekarang sudah tayang di website resmi sekolah! 🏆

🔗 Lihat sekarang: https://webmaster610.github.io/websdlab/prestasi.html
`.trim());
    }

  } catch (err) {
    console.error('Error in handleApproval:', err);
    await sendMessage(adminChatId, `⚠️ Terjadi kendala saat memproses: ${err.message}`);
  }
}

// 8. REJECT HANDLER
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
Mohon maaf, pengajuan prestasi untuk <b>${sub.student_name}</b> dalam ajang <i>${sub.competition}</i> belum dapat disetujui untuk ditayangkan ke website saat ini.
`.trim());
  }
}

// 9. COMMAND HANDLERS
async function handleCommand(chatId, text, from) {
  const cmd = text.split(' ')[0].toLowerCase();

  if (cmd === '/start' || cmd === '/help') {
    const isAdmin = String(chatId) === ADMIN_CHAT_ID;
    let msg = `
👋 <b>Halo, ${from.first_name || 'Bapak/Ibu Guru'}!</b>
Selamat datang di <b>Bot Prestasi SD Kristen Satya Wacana (SD Lab UKSW)</b>.

Bot ini berfungsi untuk memudahkan penginputan prestasi siswa langsung ke website resmi sekolah.

<b>📝 Cara Mengirimkan Prestasi Siswa:</b>
Kirimkan <b>FOTO</b> (Piala / Siswa / Sertifikat) dengan format caption seperti ini:

<code>/prestasi
Nama: Jason Samuel
Kelas: Kelas 4
Lomba: Kejuaraan Renang Antar-SD Se-Jateng
Penyelenggara: Akuatik Indonesia
Tingkat: Provinsi
Juara: 1
Kategori: Olahraga</code>

Atau ketik <b>/tambah</b> untuk panduan langkah demi langkah.
`;

    if (isAdmin) {
      msg += `
\n👑 <b>Menu Khusus Admin:</b>
• <b>/list</b> : Menampilkan prestasi aktif saat ini
• <b>/cleanup</b> : Menjalankan pembersihan otomatis prestasi kadaluarsa
• <b>/pending</b> : Menampilkan draf yang belum disetujui
`;
    }

    await sendMessage(chatId, msg.trim());
    return;
  }

  if (cmd === '/cleanup') {
    if (String(chatId) !== ADMIN_CHAT_ID) {
      await sendMessage(chatId, 'Perintah ini hanya dapat dijalankan oleh Admin.');
      return;
    }

    await sendMessage(chatId, '🧹 <i>Sedang menjalankan skrip pembersihan prestasi kadaluarsa...</i>');
    try {
      execSync('node scripts/cleanup-prestasi.js', { cwd: path.join(__dirname, '..') });
      await sendMessage(chatId, '✅ Pembersihan selesai! Data dan memori foto kadaluarsa telah dirapikan.');
    } catch (e) {
      await sendMessage(chatId, `⚠️ Gagal menjalankan cleanup: ${e.message}`);
    }
    return;
  }

  if (cmd === '/list') {
    if (!fs.existsSync(DATA_FILE)) {
      await sendMessage(chatId, 'Belum ada data prestasi di website.');
      return;
    }
    const list = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    let out = `🏆 <b>Daftar 5 Prestasi Aktif Terbaru:</b>\n\n`;
    list.slice(0, 5).forEach((p, i) => {
      out += `${i + 1}. <b>${p.student_name}</b> (${p.student_class})\n   ${p.badge}\n   Lomba: ${p.competition}\n\n`;
    });
    out += `Total aktif: ${list.length} prestasi\n🌐 webmaster610.github.io/websdlab/prestasi.html`;
    await sendMessage(chatId, out);
    return;
  }
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

        // Callback Query (Klik Tombol Persetujuan)
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
          }
          continue;
        }

        // Pesan Biasa
        if (update.message) {
          const msg = update.message;
          const chatId = msg.chat.id;
          const text = msg.text || msg.caption || '';
          const from = msg.from || {};

          // Cek Command
          if (text.startsWith('/')) {
            if (text.startsWith('/prestasi') && (msg.photo || text.includes('\n'))) {
              // Format kirim langsung dengan caption
              const parsed = parseCaptionToPrestasi(text);
              if (msg.photo && msg.photo.length > 0) {
                // Ambil foto kualitas tertinggi (elemen terakhir pada array)
                parsed.photo_file_id = msg.photo[msg.photo.length - 1].file_id;
              }

              if (!parsed.student_name || !parsed.competition) {
                await sendMessage(chatId, '⚠️ Mohon lengkapi minimal <b>Nama Siswa</b> dan <b>Nama Lomba</b> pada format.');
              } else {
                await handleNewSubmission(parsed, chatId, from.first_name || 'Bapak/Ibu');
              }
            } else {
              await handleCommand(chatId, text, from);
            }
            continue;
          }

          // Jika kirim foto dengan caption
          if (msg.photo && text.toLowerCase().includes('nama:')) {
            const parsed = parseCaptionToPrestasi(text);
            parsed.photo_file_id = msg.photo[msg.photo.length - 1].file_id;
            await handleNewSubmission(parsed, chatId, from.first_name || 'Bapak/Ibu');
            continue;
          }
        }
      }
    }
  } catch (err) {
    console.error('Polling error:', err.message);
  }

  // Lanjutkan loop polling
  setTimeout(pollUpdates, 1000);
}

console.log('====================================================');
console.log('🤖 BOT PRESTASI SD KRISTEN SATYA WACANA SIAP BERJALAN');
console.log(`Admin Chat ID: ${ADMIN_CHAT_ID}`);
console.log('Menunggu pengajuan prestasi dan persetujuan Admin...');
console.log('====================================================');

pollUpdates();

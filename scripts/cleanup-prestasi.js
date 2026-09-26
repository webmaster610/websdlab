/**
 * AUTO-CLEANUP SCRIPT: PRESTASI SD KRISTEN SATYA WACANA
 * Menghapus data prestasi yang telah melewati masa aktif (TTL)
 * dan menghapus file foto dinamis terkait dari memori repository.
 * 
 * Retention Rules:
 * - Kecamatan & Kota (Juara 2, 3, Harapan): 3 Bulan
 * - Kecamatan & Kota (Juara 1): 6 Bulan
 * - Provinsi, Nasional, Internasional: Abadi (expires_at: null)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_FILE = path.join(__dirname, '..', 'data', 'prestasi.json');

function sendTelegramNotification(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    console.log('[Notification Skipped] TELEGRAM_BOT_TOKEN atau TELEGRAM_ADMIN_CHAT_ID belum diset.');
    return;
  }

  const postData = JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML'
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    res.on('data', () => {});
  });

  req.on('error', (e) => {
    console.error('Error sending Telegram notification:', e.message);
  });

  req.write(postData);
  req.end();
}

function runCleanup() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log('File data/prestasi.json tidak ditemukan.');
    return;
  }

  const rawData = fs.readFileSync(DATA_FILE, 'utf8');
  let prestasiList = [];
  try {
    prestasiList = JSON.parse(rawData);
  } catch (err) {
    console.error('Error parsing JSON:', err.message);
    return;
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const activeItems = [];
  const removedItems = [];

  prestasiList.forEach(item => {
    if (item.expires_at) {
      const expDate = new Date(item.expires_at);
      if (expDate < now) {
        removedItems.push(item);
        
        // Hapus file gambar HANYA jika berada di folder images/prestasi/ (unggahan dinamis)
        // Jangan hapus gambar statis/aset bawaan website
        if (item.image && item.image.startsWith('images/prestasi/')) {
          const imagePath = path.join(__dirname, '..', item.image);
          if (fs.existsSync(imagePath)) {
            try {
              fs.unlinkSync(imagePath);
              console.log(`[Storage Cleaned] Foto terhapus: ${item.image}`);
            } catch (unlinkErr) {
              console.error(`Gagal menghapus foto ${imagePath}:`, unlinkErr.message);
            }
          }
        }
        return;
      }
    }
    activeItems.push(item);
  });

  if (removedItems.length > 0) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(activeItems, null, 2), 'utf8');
    console.log(`[Cleanup Berhasil] ${removedItems.length} prestasi kadaluarsa telah dibersihkan.`);

    let reportMsg = `🧹 <b>Laporan Pembersihan Otomatis (Auto-Prune) Prestasi</b>\n`;
    reportMsg += `Sebanyak <b>${removedItems.length}</b> prestasi telah selesai masa tayangnya dan dibersihkan dari web & storage:\n\n`;
    removedItems.forEach((r, idx) => {
      reportMsg += `${idx + 1}. <b>${r.student_name}</b> - ${r.title} (${r.competition})\n`;
    });
    reportMsg += `\nStatus: <i>Web & Memori Repositori Tetap Ramping & Optimal.</i>`;

    sendTelegramNotification(reportMsg);
  } else {
    console.log('[Status] Tidak ada prestasi yang kadaluarsa hari ini. Semua data aktif.');
  }
}

runCleanup();

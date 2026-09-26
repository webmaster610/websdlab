/**
 * SYSTEM AUDIT LOGGER (SD KRISTEN SATYA WACANA)
 * Mencatat seluruh mutasi data (tambah, hapus, tolak, auto-prune) secara otomatis
 * ke data/activity_log.json dan docs/ACTIVITY_LOG.md.
 */

const fs = require('fs');
const path = require('path');

const LOG_JSON_FILE = path.join(__dirname, '..', 'data', 'activity_log.json');
const LOG_MD_FILE = path.join(__dirname, '..', 'docs', 'ACTIVITY_LOG.md');

function recordActivity(action, details = {}, actor = 'Admin') {
  try {
    const now = new Date();
    // UTC+7 (WIB) conversion
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const wib = new Date(utc + (7 * 3600000));
    const dateStr = wib.toISOString().split('T')[0];
    const timeStr = wib.toISOString().split('T')[1].substring(0, 5);
    const displayTime = `${dateStr} ${timeStr} WIB`;

    const logEntry = {
      id: 'act_' + Date.now(),
      timestamp: wib.toISOString(),
      display_time: displayTime,
      action: action, // TAMBAH, HAPUS, TOLAK, AUTO_PRUNE
      category_tag: details.category_tag || 'PRESTASI',
      target_id: details.id || null,
      student_name: details.student_name || '-',
      student_class: details.student_class || '-',
      competition: details.competition || '-',
      badge: details.badge || '-',
      category: details.category || '-',
      actor: actor,
      expires_at: details.expires_at || null,
      image: details.image || '-',
      notes: details.notes || ''
    };

    // 1. Simpan ke data/activity_log.json
    let logs = [];
    if (fs.existsSync(LOG_JSON_FILE)) {
      try {
        logs = JSON.parse(fs.readFileSync(LOG_JSON_FILE, 'utf8'));
      } catch (e) {
        logs = [];
      }
    }
    logs.unshift(logEntry);
    fs.writeFileSync(LOG_JSON_FILE, JSON.stringify(logs, null, 2), 'utf8');

    // 2. Tambahkan baris baru ke tabel docs/ACTIVITY_LOG.md
    if (fs.existsSync(LOG_MD_FILE)) {
      let md = fs.readFileSync(LOG_MD_FILE, 'utf8');
      const tableMarker = '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';
      const markerIdx = md.indexOf(tableMarker);
      if (markerIdx !== -1) {
        const insertPos = markerIdx + tableMarker.length;
        const newRow = `| **${displayTime}** | \`${action}\` | **#${details.id || '-'}** | **${details.student_name}** (${details.student_class || '-'}) | ${details.competition} (*${details.badge || '-'}*) | ${details.category || '-'} | ${actor} | ${details.notes || '-'} |\n`;
        md = md.substring(0, insertPos) + newRow + md.substring(insertPos);
        fs.writeFileSync(LOG_MD_FILE, md, 'utf8');
      }
    }

    console.log(`[Audit Log Recorded]: [${action}] #${details.id || '-'} ${details.student_name || details.competition}`);
    return logEntry;
  } catch (err) {
    console.error('[Audit Log Warning]: Gagal mencatat log aktivitas:', err.message);
    return null;
  }
}

module.exports = {
  recordActivity,
  LOG_JSON_FILE,
  LOG_MD_FILE
};

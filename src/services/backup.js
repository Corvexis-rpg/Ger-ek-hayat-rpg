// JSON dışa/içe aktarma + otomatik yerel yedek (güvenlik ağı).
import * as db from '../db.js';
import { todayKey } from './time.js';

const AUTO_KEY = 'ghrpg:autobackup';

export async function buildBackup() {
  const data = await db.exportAll();
  return {
    app: 'gercek-hayat-rpg',
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export async function exportToFile() {
  const backup = await buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gercek-hayat-rpg-yedek-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || !parsed.data) throw new Error('Geçersiz yedek dosyası');
        resolve(parsed.data);
      } catch (e) { reject(e); }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// Otomatik yerel yedek: günde bir kez localStorage'a anlık görüntü.
export async function autoLocalBackup(force = false) {
  try {
    const existing = JSON.parse(localStorage.getItem(AUTO_KEY) || 'null');
    if (!force && existing && existing.day === todayKey()) return false;
    const backup = await buildBackup();
    localStorage.setItem(AUTO_KEY, JSON.stringify({ day: todayKey(), backup }));
    return true;
  } catch (e) {
    return false;
  }
}

export function getLocalBackupInfo() {
  try {
    const existing = JSON.parse(localStorage.getItem(AUTO_KEY) || 'null');
    if (!existing) return null;
    return { day: existing.day, exportedAt: existing.backup.exportedAt };
  } catch { return null; }
}

export function getLocalBackupData() {
  try {
    const existing = JSON.parse(localStorage.getItem(AUTO_KEY) || 'null');
    return existing ? existing.backup.data : null;
  } catch { return null; }
}

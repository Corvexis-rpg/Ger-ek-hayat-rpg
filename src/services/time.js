// Yerel saat tabanlı tarih yardımcıları. Tüm "gün" anahtarları YYYY-MM-DD (yerel).

export function pad(n) { return String(n).padStart(2, '0'); }

export function dayKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey() { return dayKey(new Date()); }

export function dateFromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const d = dateFromKey(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

// b - a, tam gün farkı
export function daysBetween(aKey, bKey) {
  const a = dateFromKey(aKey), b = dateFromKey(bKey);
  return Math.round((b - a) / 86400000);
}

export function isYesterday(prevKey, refKey = todayKey()) {
  return daysBetween(prevKey, refKey) === 1;
}

// ISO hafta anahtarı: YYYY-Www
export function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Pazartesi=0
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(
    ((d - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7
  );
  return `${d.getUTCFullYear()}-W${pad(week)}`;
}

export function startOfWeekKey(key = todayKey()) {
  const d = dateFromKey(key);
  const day = (d.getDay() + 6) % 7; // Pazartesi=0
  d.setDate(d.getDate() - day);
  return dayKey(d);
}

export function hourOf(ts) { return new Date(ts).getHours(); }

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const DAYS_LONG = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export function formatDay(key) {
  const d = dateFromKey(key);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatDayLong(key) {
  const d = dateFromKey(key);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${DAYS_LONG[d.getDay()]}`;
}

export function dayShort(key) { return DAYS[dateFromKey(key).getDay()]; }
export function monthShort(i) { return MONTHS[i]; }

export function formatTime(ts) {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function relativeTime(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'az önce';
  if (min < 60) return `${min} dk önce`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} saat önce`;
  const day = Math.floor(hr / 24);
  if (day === 1) return 'dün';
  if (day < 7) return `${day} gün önce`;
  return formatDay(dayKey(new Date(ts)));
}

// Basit tohumlu rastgele (gün/hafta bazlı deterministik seçim için)
export function seededRandom(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function () {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickN(arr, n, rng) {
  const copy = arr.slice();
  const out = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(rng() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

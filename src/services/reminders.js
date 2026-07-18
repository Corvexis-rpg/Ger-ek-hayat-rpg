// Nazik hatırlatmalar: seri riski + paslanma. Günde en fazla 1-2, asla suçlayıcı değil.
import { state, settings } from '../store.js';
import { STAT_MAP, MAIN_STATS } from '../config/stats.js';
import { typeMap } from '../store.js';
import { atRisk, effectiveStreak, OVERALL_KEY } from '../domain/streaks.js';
import { idleDays, GRACE_DAYS } from '../domain/rust.js';
import { todayKey } from './time.js';
import { notify } from './notifications.js';

const SENT_KEY = 'ghrpg:reminded';

// Uygulama içi gösterilecek nazik hatırlatmalar (en fazla 2).
export function getReminders() {
  const out = [];
  const tm = typeMap();
  const today = todayKey();

  // 1) risk altındaki seriler (en uzun olan öncelikli)
  const risky = [];
  for (const [key, s] of Object.entries(state.streaks || {})) {
    if (key === OVERALL_KEY) continue;
    if (atRisk(s, today)) {
      const t = tm[key];
      if (t) risky.push({ name: t.name, icon: t.icon, days: effectiveStreak(s, today) });
    }
  }
  risky.sort((a, b) => b.days - a.days);
  if (risky[0]) {
    const r = risky[0];
    out.push({
      type: 'streak', icon: r.icon,
      message: `${r.icon} "${r.name}" serisi ${r.days} günde — bugün küçük bir adımla sürdürebilirsin.`,
    });
  }

  // 2) paslanan ana stat (en uzun süredir dokunulmayan)
  let worst = null;
  for (const s of MAIN_STATS) {
    const prog = state.statProgress[s.id];
    const d = idleDays(prog, today);
    if (d > GRACE_DAYS && isFinite(d)) {
      if (!worst || d > worst.days) worst = { stat: s, days: d };
    }
  }
  if (worst && out.length < 2) {
    out.push({
      type: 'rust', icon: worst.stat.icon,
      message: `${worst.stat.icon} ${worst.days} gündür ${worst.stat.name}'e dokunmadın — bir başlangıç nasıl olur?`,
    });
  }

  return out.slice(0, 2);
}

// İzin varsa günde bir kez sistem bildirimi gönder (bunaltmadan).
export function maybeSendSystemReminder() {
  if (!settings().reminders) return;
  const today = todayKey();
  let sent = null;
  try { sent = JSON.parse(localStorage.getItem(SENT_KEY) || 'null'); } catch {}
  if (sent && sent.day === today) return;

  const reminders = getReminders();
  const msg = reminders.length
    ? reminders[0].message.replace(/^[^\s]+\s/, '')
    : 'Bugün küçük bir adım atmayı unutma — kahramanın seni bekliyor! ⚔️';
  const ok = notify('Gerçek Hayat RPG', msg);
  if (ok) localStorage.setItem(SENT_KEY, JSON.stringify({ day: today }));
}

// Günlük hatırlatmayı belirlenen saate zamanla (uygulama açıkken çalışır).
let _timer = null;
export function scheduleDailyReminder() {
  if (_timer) { clearTimeout(_timer); _timer = null; }
  if (!settings().reminders) return;
  const [h, m] = String(settings().reminderTime || '20:00').split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h || 20, m || 0, 0, 0);
  if (target <= now) {
    // saat geçmiş: bugün henüz gönderilmediyse hemen dene
    maybeSendSystemReminder();
    return;
  }
  const ms = Math.min(target - now, 2 ** 31 - 1);
  _timer = setTimeout(() => { maybeSendSystemReminder(); }, ms);
}

// "Paslanma" — nazik zorluk mekaniği. Uzun süre dokunulmayan statta çok küçük,
// kademeli bir düşüş. Bir eylemle anında durur, telafi bonusu vermez, cezalandırmaz.
import { todayKey, daysBetween } from '../services/time.js';

export const GRACE_DAYS = 3;   // bu kadar gün dokunulmazsa paslanma başlar
export const MAX_STEP = 12;    // günlük düşüş üst sınırı
export const MIN_STEP = 2;

// Bir stat için bugün uygulanacak paslanma miktarını hesapla.
// prog: { xp, lastActivityDay, lastRustDay }
export function rustAmount(prog, ref = todayKey()) {
  if (!prog || !prog.lastActivityDay) return 0;
  const idle = daysBetween(prog.lastActivityDay, ref);
  if (idle <= GRACE_DAYS) return 0;
  if (prog.lastRustDay === ref) return 0; // bugün zaten uygulandı
  const step = Math.min(MAX_STEP, Math.max(MIN_STEP, Math.round((prog.xp || 0) * 0.01)));
  return Math.min(step, prog.xp || 0);
}

// Kaç gündür ilgili stata dokunulmadı (nazik hatırlatma metinleri için).
export function idleDays(prog, ref = todayKey()) {
  if (!prog || !prog.lastActivityDay) return Infinity;
  return daysBetween(prog.lastActivityDay, ref);
}

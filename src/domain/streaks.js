// Seri (streak) mantığı — saf fonksiyonlar. Durum store'da tutulur.
import { todayKey, daysBetween } from '../services/time.js';
import { multiplierForStreak } from './xp.js';

export const OVERALL_KEY = '__overall__';

export function emptyStreak() {
  return { current: 0, longest: 0, lastDay: null, multiplier: 1.0 };
}

// Bir eylem `day` gününde işlendiğinde seriyi güncelle. Yeni streak nesnesi döner.
// `continued`: bu güncellemeyle seri bir önceki günden devam mı ettirildi (disiplin bonusu için).
export function applyStreak(streak, day) {
  const s = streak ? { ...streak } : emptyStreak();
  let continued = false;
  if (s.lastDay === day) {
    // bugün zaten sayıldı — çarpan aynı kalır
  } else if (s.lastDay && daysBetween(s.lastDay, day) === 1) {
    s.current += 1;
    continued = true;
  } else {
    s.current = 1; // ilk gün veya seri kırılmış → yeniden başla
  }
  s.lastDay = day;
  s.longest = Math.max(s.longest || 0, s.current);
  s.multiplier = multiplierForStreak(s.current);
  return { streak: s, continued };
}

// Görüntülenen (efektif) seri: dün/bugün aktifse geçerli, değilse kırılmış (0).
export function effectiveStreak(streak, ref = todayKey()) {
  if (!streak || !streak.lastDay) return 0;
  const d = daysBetween(streak.lastDay, ref);
  if (d <= 0) return streak.current;      // bugün
  if (d === 1) return streak.current;     // dün — bugün devam ettirilebilir
  return 0;                               // kırılmış
}

export function effectiveMultiplier(streak, ref = todayKey()) {
  return multiplierForStreak(effectiveStreak(streak, ref));
}

// Bugün risk altında mı? (dün aktifti, bugün henüz yapılmadı ve seri >=2)
export function atRisk(streak, ref = todayKey()) {
  if (!streak || !streak.lastDay) return false;
  return daysBetween(streak.lastDay, ref) === 1 && streak.current >= 2;
}

// XP → seviye eğrisi ve seri çarpanları.

// Stat seviyesi için: `level` seviyesinden bir üste geçmek için gereken XP.
export function statReqForLevel(level) {
  return 80 + (level - 1) * 55; // L1→2: 80, artan
}

// Karakter (toplam) seviyesi daha yavaş artar.
export function charReqForLevel(level) {
  return 300 + (level - 1) * 160;
}

function levelInfo(totalXp, reqFn) {
  let level = 1;
  let rem = Math.max(0, Math.floor(totalXp));
  // güvenlik sınırı
  while (level < 999 && rem >= reqFn(level)) {
    rem -= reqFn(level);
    level++;
  }
  const needed = reqFn(level);
  return { level, intoLevel: rem, needed, progress: needed ? rem / needed : 0 };
}

export function statLevelInfo(totalXp) { return levelInfo(totalXp, statReqForLevel); }
export function charLevelInfo(totalXp) { return levelInfo(totalXp, charReqForLevel); }

export function levelFromStatXp(totalXp) { return statLevelInfo(totalXp).level; }

// Seri çarpanı eşikleri (3/7/14/30 gün).
export const STREAK_TIERS = [
  { days: 30, mult: 2.0 },
  { days: 14, mult: 1.5 },
  { days: 7,  mult: 1.25 },
  { days: 3,  mult: 1.1 },
  { days: 0,  mult: 1.0 },
];

export function multiplierForStreak(streakDays) {
  for (const t of STREAK_TIERS) if (streakDays >= t.days) return t.mult;
  return 1.0;
}

// Bir sonraki çarpan eşiğine kaç gün kaldı (motivasyon için).
export function nextStreakTier(streakDays) {
  const higher = STREAK_TIERS.filter((t) => t.days > streakDays).sort((a, b) => a.days - b.days);
  return higher.length ? higher[0] : null;
}

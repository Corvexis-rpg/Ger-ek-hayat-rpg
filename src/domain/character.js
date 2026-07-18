// Karakterin türetilmiş özellikleri: toplam XP/seviye, sınıf, unvan.
import { MAIN_STATS, STATS, CLASSES, CLASS_BALANCED } from '../config/stats.js';
import { statLevelInfo, charLevelInfo } from './xp.js';
import { titleForLevel } from '../config/titles.js';

export function totalXp(statProgress) {
  return STATS.reduce((sum, s) => sum + ((statProgress[s.id] && statProgress[s.id].xp) || 0), 0);
}

export function characterInfo(statProgress) {
  const total = totalXp(statProgress);
  const info = charLevelInfo(total);
  return { ...info, totalXp: total };
}

export function statLevels(statProgress) {
  const out = {};
  for (const s of STATS) out[s.id] = statLevelInfo((statProgress[s.id] && statProgress[s.id].xp) || 0).level;
  return out;
}

// Sınıf: en yüksek ana stat'a göre. Beraberlik veya hepsi 0 ise "Dengeli Gezgin".
export function deriveClass(statProgress) {
  let best = null, bestXp = -1, tie = false;
  for (const s of MAIN_STATS) {
    const xp = (statProgress[s.id] && statProgress[s.id].xp) || 0;
    if (xp > bestXp) { bestXp = xp; best = s.id; tie = false; }
    else if (xp === bestXp) { tie = true; }
  }
  if (bestXp <= 0 || tie) return CLASS_BALANCED;
  return CLASSES[best] || CLASS_BALANCED;
}

export function deriveTitle(statProgress) {
  return titleForLevel(characterInfo(statProgress).level);
}

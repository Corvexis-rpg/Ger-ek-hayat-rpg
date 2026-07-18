// Başarım değerlendirme motoru.
import { ACHIEVEMENTS } from '../config/achievements.js';
import { MAIN_STATS } from '../config/stats.js';
import { statLevels as deriveStatLevels, characterInfo } from './character.js';
import { OVERALL_KEY } from './streaks.js';
import { hourOf } from '../services/time.js';

// Başarım kontrolleri için özet durum nesnesi üret.
export function buildSummary(state) {
  const { actions, statProgress, streaks, actionTypes } = state;
  const statLevels = deriveStatLevels(statProgress);
  const characterLevel = characterInfo(statProgress).level;

  let longestStreakAny = 0;
  let longestOverallStreak = 0;
  for (const [key, s] of Object.entries(streaks || {})) {
    const best = Math.max(s.longest || 0, s.current || 0);
    if (key === OVERALL_KEY) longestOverallStreak = best;
    else longestStreakAny = Math.max(longestStreakAny, best);
  }

  let minMainLevel = Infinity;
  for (const s of MAIN_STATS) minMainLevel = Math.min(minMainLevel, statLevels[s.id] || 0);
  if (!isFinite(minMainLevel)) minMainLevel = 0;

  const hasCustomType = (actionTypes || []).some((t) => t.isCustom);
  const leveledUpOnce = Object.values(statLevels).some((l) => l > 1) || characterLevel > 1;
  const nightAction = (actions || []).some((a) => {
    const h = hourOf(a.timestamp);
    return h >= 0 && h < 4;
  });

  // kategori ve eylem türü sayımları
  const typeById = Object.fromEntries((actionTypes || []).map((t) => [t.id, t]));
  const categoryCounts = {};
  const actionTypeCounts = {};
  for (const a of actions || []) {
    actionTypeCounts[a.actionTypeId] = (actionTypeCounts[a.actionTypeId] || 0) + 1;
    const t = typeById[a.actionTypeId];
    if (t) categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  }
  const routineCount = ((state.meta && state.meta.settings && state.meta.settings.routine) || []).length;

  // gün bazlı en yüksek XP, notlu eylem, sabah/hafta sonu, çeşitlilik, tamamlanan görev
  const perDay = {};
  let bestDayXp = 0, actionsWithNotes = 0, earlyAction = false, weekendAction = false;
  for (const a of actions || []) {
    const xp = (a.statAwards || []).reduce((s, w) => s + w.xp, 0);
    perDay[a.day] = (perDay[a.day] || 0) + xp;
    if (perDay[a.day] > bestDayXp) bestDayXp = perDay[a.day];
    if (a.note) actionsWithNotes++;
    const h = hourOf(a.timestamp);
    if (h >= 5 && h < 8) earlyAction = true;
    const dow = new Date(a.timestamp).getDay();
    if (dow === 0 || dow === 6) weekendAction = true;
  }
  const distinctTypesUsed = new Set((actions || []).map((a) => a.actionTypeId)).size;
  const questsCompleted = (state.quests || []).filter((q) => q.status === 'completed').length;

  return {
    bestDayXp,
    actionsWithNotes,
    earlyAction,
    weekendAction,
    distinctTypesUsed,
    questsCompleted,
    totalActions: (actions || []).length,
    statLevels,
    minMainLevel,
    characterLevel,
    longestStreakAny,
    longestOverallStreak,
    hasCustomType,
    leveledUpOnce,
    nightAction,
    categoryCounts,
    actionTypeCounts,
    routineCount,
  };
}

// Henüz açılmamış ama şartı sağlanan başarımların id listesini döner.
export function newlyUnlocked(state, unlockedMap) {
  const sum = buildSummary(state);
  const out = [];
  for (const a of ACHIEVEMENTS) {
    if (unlockedMap[a.id]) continue;
    try {
      if (a.check(sum)) out.push(a.id);
    } catch (_) { /* güvenli yoksay */ }
  }
  return out;
}

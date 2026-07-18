// Görev değerlendirme ve üretim mantığı (saf fonksiyonlar).
import { DAILY_POOL, WEEKLY_POOL, SIDE_POOL, DAILY_COUNT, WEEKLY_COUNT } from '../config/quests.js';
import { weekKey, dateFromKey, daysBetween, seededRandom, pickN } from '../services/time.js';

export function actionMatches(action, match, typeMap) {
  if (!match) return true;
  const type = typeMap[action.actionTypeId];
  if (match.actionTypeId && action.actionTypeId !== match.actionTypeId) return false;
  if (match.category && (!type || type.category !== match.category)) return false;
  if (match.statId) {
    const awards = action.statAwards || (type ? type.awards : []);
    if (!awards.some((a) => a.statId === match.statId)) return false;
  }
  return true;
}

// Görevin ait olduğu döneme giren eylemleri süz.
export function filterPeriodActions(actions, period, periodKey) {
  if (period === 'week') {
    return actions.filter((a) => weekKey(dateFromKey(a.day)) === periodKey);
  }
  // day (günlük ve yan görev)
  return actions.filter((a) => a.day === periodKey);
}

// {progress, target, done}
export function evaluate(quest, periodActions, typeMap) {
  const c = quest.criteria;
  const target = c.target || 1;
  let progress = 0;
  switch (c.kind) {
    case 'action_count':
      progress = periodActions.filter((a) => actionMatches(a, c.match, typeMap)).length;
      break;
    case 'any_action':
      progress = periodActions.length;
      break;
    case 'distinct_types':
      progress = new Set(periodActions.map((a) => a.actionTypeId)).size;
      break;
    case 'distinct_stats': {
      const set = new Set();
      for (const a of periodActions) {
        const awards = a.statAwards || (typeMap[a.actionTypeId] ? typeMap[a.actionTypeId].awards : []);
        for (const w of awards) set.add(w.statId);
      }
      progress = set.size;
      break;
    }
    case 'active_days':
      progress = new Set(periodActions.map((a) => a.day)).size;
      break;
    case 'streak_goal': {
      // en uzun ardışık gün serisi (hedef eylem için, yoksa herhangi eylem)
      const days = [...new Set(periodActions
        .filter((a) => !c.actionTypeId || a.actionTypeId === c.actionTypeId)
        .map((a) => a.day))].sort();
      let best = 0, run = 0, prev = null;
      for (const d of days) {
        if (prev && daysBetween(prev, d) === 1) run++; else run = 1;
        if (run > best) best = run;
        prev = d;
      }
      progress = best;
      break;
    }
    case 'manual':
      progress = quest.manualDone ? 1 : 0;
      break;
    default:
      progress = 0;
  }
  progress = Math.min(progress, target);
  return { progress, target, done: progress >= target };
}

export function selectDaily(dateKey) {
  const rng = seededRandom('daily:' + dateKey);
  return pickN(DAILY_POOL, DAILY_COUNT, rng);
}

export function selectWeekly(wKey) {
  const rng = seededRandom('weekly:' + wKey);
  return pickN(WEEKLY_POOL, WEEKLY_COUNT, rng);
}

// Yan görev: her gün ~%40 olasılıkla bir öneri (seeded, deterministik).
export function selectSide(dateKey) {
  const rng = seededRandom('side:' + dateKey);
  if (rng() > 0.4) return null;
  return pickN(SIDE_POOL, 1, rng)[0] || null;
}

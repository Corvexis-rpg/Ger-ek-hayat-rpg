// Türetilmiş istatistikler: seriler, rekorlar, haftalık özet, "geçmişte bugün".
import { STATS, STAT_MAP, MAIN_STATS } from '../config/stats.js';
import { dayKey, todayKey, addDays, daysBetween, dateFromKey, hourOf,
  startOfWeekKey, dayShort } from '../services/time.js';

export function actionXp(action) {
  return (action.statAwards || []).reduce((s, a) => s + a.xp, 0);
}

// statId=null → tüm statlar toplamı. Gün → toplam XP.
export function xpPerDay(actions, statId = null) {
  const map = new Map();
  for (const a of actions) {
    let xp = 0;
    if (statId) {
      for (const w of a.statAwards || []) if (w.statId === statId) xp += w.xp;
    } else {
      xp = actionXp(a);
    }
    if (xp) map.set(a.day, (map.get(a.day) || 0) + xp);
  }
  return map;
}

// Son `days` gün için sürekli seri (boşluklar 0). [{day, value}]
export function dailySeries(actions, statId, days) {
  const map = xpPerDay(actions, statId);
  const out = [];
  const today = todayKey();
  for (let i = days - 1; i >= 0; i--) {
    const k = addDays(today, -i);
    out.push({ day: k, value: map.get(k) || 0 });
  }
  return out;
}

// Kümülatif seviye gelişimi (yaklaşık) — istenirse çizgi grafik için.
export function cumulativeSeries(actions, statId, days) {
  const daily = dailySeries(actions, statId, days);
  let acc = 0;
  return daily.map((d) => { acc += d.value; return { day: d.day, value: acc }; });
}

// Radar için her stat'ın seviyesi (store'dan gelen statLevels ile de yapılabilir).
export function xpByStat(actions) {
  const out = {};
  for (const s of STATS) out[s.id] = 0;
  for (const a of actions) for (const w of a.statAwards || []) out[w.statId] = (out[w.statId] || 0) + w.xp;
  return out;
}

export function records(actions, longestStreak = 0) {
  if (!actions.length) {
    return { totalActions: 0, activeDays: 0, bestDayXp: 0, bestDay: null,
      mostActiveHour: null, mostActiveWeekday: null, longestStreak, firstDay: null };
  }
  const perDay = xpPerDay(actions, null);
  let bestDay = null, bestDayXp = 0;
  for (const [day, xp] of perDay) if (xp > bestDayXp) { bestDayXp = xp; bestDay = day; }

  const hours = new Array(24).fill(0);
  const weekdays = new Array(7).fill(0);
  let firstDay = actions[0].day;
  for (const a of actions) {
    hours[hourOf(a.timestamp)]++;
    weekdays[dateFromKey(a.day).getDay()]++;
    if (a.day < firstDay) firstDay = a.day;
  }
  const mh = hours.indexOf(Math.max(...hours));
  const mw = weekdays.indexOf(Math.max(...weekdays));

  return {
    totalActions: actions.length,
    activeDays: perDay.size,
    bestDayXp, bestDay,
    mostActiveHour: mh,
    mostActiveWeekday: mw,
    longestStreak,
    firstDay,
  };
}

// Bu hafta vs geçen hafta, stat bazında XP + nazik gözlemler.
export function weeklySummary(actions) {
  const thisStart = startOfWeekKey(todayKey());
  const lastStart = addDays(thisStart, -7);
  const thisWeek = {}, lastWeek = {};
  for (const s of STATS) { thisWeek[s.id] = 0; lastWeek[s.id] = 0; }
  let thisCount = 0, lastCount = 0;

  for (const a of actions) {
    const inThis = a.day >= thisStart;
    const inLast = a.day >= lastStart && a.day < thisStart;
    if (!inThis && !inLast) continue;
    for (const w of a.statAwards || []) {
      if (inThis) thisWeek[w.statId] += w.xp;
      else lastWeek[w.statId] += w.xp;
    }
    if (inThis) thisCount++; else lastCount++;
  }

  const totalThis = Object.values(thisWeek).reduce((a, b) => a + b, 0);
  // en çok / en az yatırım yapılan ana stat
  let top = null, topXp = -1, low = null, lowXp = Infinity;
  for (const s of MAIN_STATS) {
    const xp = thisWeek[s.id];
    if (xp > topXp) { topXp = xp; top = s.id; }
    if (xp < lowXp) { lowXp = xp; low = s.id; }
  }

  const notes = [];
  if (totalThis === 0) {
    notes.push('Bu hafta henüz eylem yok — küçük bir adımla başlayabilirsin.');
  } else {
    if (top) notes.push(`Bu hafta en çok ${STAT_MAP[top].name} statına yatırım yaptın.`);
    if (low != null && lowXp === 0) notes.push(`${STAT_MAP[low].name} biraz geride kaldı — bir mini eylem dengeyi kurar.`);
    else if (low && low !== top) notes.push(`${STAT_MAP[low].name} biraz geride kaldı.`);
    if (lastCount > 0) {
      const diff = thisCount - lastCount;
      if (diff > 0) notes.push(`Geçen haftaya göre ${diff} eylem daha fazla — ivme sende!`);
      else if (diff < 0) notes.push(`Geçen haftaya göre biraz daha sakin bir hafta, sorun değil.`);
      else notes.push('Geçen haftayla aynı tempodasın — istikrar güzel.');
    }
  }

  return { thisWeek, lastWeek, totalThis, thisCount, lastCount, top, low, notes, weekStart: thisStart };
}

// "Geçmişte bugün": aynı ay-gün, önceki aylardan/yıllardan eylemler.
export function onThisDay(actions, ref = todayKey()) {
  const rd = dateFromKey(ref);
  const results = [];
  for (const a of actions) {
    const d = dateFromKey(a.day);
    if (a.day === ref) continue;
    const sameDayOfMonth = d.getDate() === rd.getDate();
    const monthsAgo = (rd.getFullYear() - d.getFullYear()) * 12 + (rd.getMonth() - d.getMonth());
    if (sameDayOfMonth && monthsAgo >= 1) results.push({ action: a, monthsAgo });
  }
  return results;
}

export function weekdayName(i) {
  return ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][i];
}

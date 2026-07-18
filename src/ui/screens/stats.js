// İstatistikler: gelişim grafiği, radar dağılımı, haftalık özet, rekorlar, "geçmişte bugün".
import { el } from '../components/dom.js';
import { lineChart, radarChart, barChart, sparkline, chartCard } from '../components/charts.js';
import * as store from '../../store.js';
import { STATS, STAT_MAP, MAIN_STATS, statById } from '../../config/stats.js';
import { statLevelInfo } from '../../domain/xp.js';
import { OVERALL_KEY } from '../../domain/streaks.js';
import { dailySeries, records, weeklySummary, onThisDay, xpByStat, xpPerDay, weekdayName } from '../../domain/stats.js';
import { formatDay, formatTime, relativeTime, todayKey, addDays, dateFromKey, monthShort } from '../../services/time.js';

const ui = { range: 30, stat: null }; // stat: null=toplam

export function renderStats() {
  const wrap = el('div', { class: 'page stats' });
  wrap.appendChild(el('div', { class: 'page-head' }, el('h1', {}, 'İstatistikler')));
  const actions = store.state.actions;

  if (!actions.length) {
    wrap.appendChild(el('div', { class: 'card empty-card' },
      el('div', { class: 'empty-emoji' }, '📊'),
      el('p', { class: 'muted' }, 'Veri biriktikçe grafiklerin burada belirecek. İlk eylemini ekle!')));
    return wrap;
  }

  // --- gelişim grafiği ---
  const rangeRow = el('div', { class: 'seg' },
    ...[[7, '7 gün'], [30, '30 gün'], [90, '90 gün']].map(([v, l]) =>
      el('button', { class: 'seg-btn' + (ui.range === v ? ' active' : ''), onclick: () => { ui.range = v; rerender(); } }, l)));

  const statRow = el('div', { class: 'chip-scroll' },
    el('button', { class: 'mini-chip' + (ui.stat === null ? ' active' : ''), onclick: () => { ui.stat = null; rerender(); } }, '⚡ Toplam'),
    ...STATS.map((s) => el('button', { class: 'mini-chip' + (ui.stat === s.id ? ' active' : ''),
      onclick: () => { ui.stat = s.id; rerender(); } }, `${s.icon} ${s.name}`)));

  const series = dailySeries(actions, ui.stat, ui.range);
  const color = ui.stat ? STAT_MAP[ui.stat].color : 'var(--accent)';
  const totalRange = series.reduce((s, d) => s + d.value, 0);
  const growthCard = chartCard(
    ui.stat ? `${STAT_MAP[ui.stat].icon} ${STAT_MAP[ui.stat].name} Gelişimi` : '⚡ Toplam XP Gelişimi',
    lineChart(series, { color }),
    `Son ${ui.range} günde ${totalRange} XP`,
  );
  growthCard.prepend(rangeRow);
  growthCard.append(statRow);
  wrap.appendChild(growthCard);

  // --- radar dağılımı ---
  const levels = {};
  for (const s of STATS) levels[s.id] = statLevelInfo(store.state.statProgress[s.id].xp).level;
  const maxLevel = Math.max(1, ...Object.values(levels));
  const axes = STATS.map((s) => ({ label: s.name.slice(0, 6), color: s.color, value: levels[s.id] / maxLevel }));
  wrap.appendChild(chartCard('🕸️ Stat Dağılımı', radarChart(axes, { size: 260 }), 'Seviyelere göre denge'));

  // --- aktiflik takvimi (heatmap) ---
  wrap.appendChild(el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, '🔥 Aktiflik Takvimi'), el('span', { class: 'muted small' }, 'Son 13 hafta')),
    activityHeatmap(actions),
    el('div', { class: 'hm-legend' },
      el('span', { class: 'muted small' }, 'az'),
      el('span', { class: 'hm-cell hm-1' }), el('span', { class: 'hm-cell hm-2' }),
      el('span', { class: 'hm-cell hm-3' }), el('span', { class: 'hm-cell hm-4' }),
      el('span', { class: 'muted small' }, 'çok')),
  ));

  // --- stat başına gelişim (sparkline) ---
  const sparkCard = el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, '📈 Stat Gelişimi'), el('span', { class: 'muted small' }, 'Son 30 gün')));
  const sparkGrid = el('div', { class: 'sparkgrid' });
  for (const s of STATS) {
    const li = statLevelInfo(store.state.statProgress[s.id].xp);
    sparkGrid.appendChild(el('div', { class: 'spark-item' },
      el('div', { class: 'spark-head' },
        el('span', { class: 'spark-name' }, `${s.icon} ${s.name}`),
        el('span', { class: 'spark-lvl', style: { color: s.color } }, 'Sv ' + li.level)),
      sparkline(dailySeries(actions, s.id, 30), { color: s.color })));
  }
  sparkCard.appendChild(sparkGrid);
  wrap.appendChild(sparkCard);

  // --- haftalık özet ---
  const ws = weeklySummary(actions);
  const barData = MAIN_STATS.map((s) => ({ label: s.name.slice(0, 4), value: ws.thisWeek[s.id], color: s.color }));
  const weeklyCard = el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, '📅 Bu Haftanın Özeti')),
    barChart(barData),
    el('div', { class: 'notes' }, ...ws.notes.map((n) => el('div', { class: 'note-line' }, '• ' + n))),
  );
  wrap.appendChild(weeklyCard);

  // --- kişisel rekorlar ---
  let longest = 0;
  for (const [k, s] of Object.entries(store.state.streaks)) longest = Math.max(longest, s.longest || 0, s.current || 0);
  const rec = records(actions, longest);
  wrap.appendChild(el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, '🏆 Kişisel Rekorlar')),
    el('div', { class: 'record-grid' },
      recordItem('🔥', 'En uzun seri', rec.longestStreak + ' gün'),
      recordItem('⚡', 'En yüksek günlük XP', rec.bestDayXp + (rec.bestDay ? ` (${formatDay(rec.bestDay)})` : '')),
      recordItem('🕐', 'En aktif saat', rec.mostActiveHour != null ? `${String(rec.mostActiveHour).padStart(2, '0')}:00` : '—'),
      recordItem('📆', 'En aktif gün', rec.mostActiveWeekday != null ? weekdayName(rec.mostActiveWeekday) : '—'),
      recordItem('📝', 'Toplam eylem', rec.totalActions),
      recordItem('🗓️', 'Aktif gün', rec.activeDays),
    ),
  ));

  // --- geçmişte bugün ---
  const otd = onThisDay(actions);
  if (otd.length) {
    const tm = store.typeMap();
    const card = el('div', { class: 'card' }, el('div', { class: 'card-head' }, el('h3', {}, '⏳ Geçmişte Bugün')));
    otd.slice(0, 5).forEach(({ action, monthsAgo }) => {
      const t = tm[action.actionTypeId];
      card.appendChild(el('div', { class: 'otd-row' },
        el('span', { class: 'otd-ic' }, t ? t.icon : '❔'),
        el('div', { class: 'otd-main' },
          el('div', {}, t ? t.name : 'Eylem'),
          el('div', { class: 'muted small' }, monthsAgo < 12 ? `${monthsAgo} ay önce` : `${Math.floor(monthsAgo / 12)} yıl önce`)),
      ));
    });
    wrap.appendChild(card);
  }

  function rerender() {
    const parent = wrap.parentNode;
    if (parent) parent.replaceChild(renderStats(), wrap);
  }

  return wrap;
}

function hmBucket(xp) {
  if (!xp) return 0;
  if (xp <= 25) return 1;
  if (xp <= 60) return 2;
  if (xp <= 120) return 3;
  return 4;
}

function activityHeatmap(actions) {
  const map = xpPerDay(actions, null);
  const today = todayKey();
  let start = addDays(today, -(13 * 7 - 1));
  const startDow = (dateFromKey(start).getDay() + 6) % 7; // Pazartesi=0
  start = addDays(start, -startDow);
  const days = [];
  let d = start;
  while (d <= today) { days.push(d); d = addDays(d, 1); }
  while (days.length % 7 !== 0) days.push(null);
  const cols = [];
  for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));

  return el('div', { class: 'heatmap' },
    ...cols.map((col) => el('div', { class: 'hm-col' },
      ...col.map((day) => {
        if (!day) return el('div', { class: 'hm-cell hm-empty' });
        const xp = map.get(day) || 0;
        return el('div', { class: 'hm-cell hm-' + hmBucket(xp), title: `${formatDay(day)}: ${xp} XP` });
      }))));
}

function recordItem(icon, label, value) {
  return el('div', { class: 'record-item' },
    el('div', { class: 'rec-ic' }, icon),
    el('div', { class: 'rec-val' }, String(value)),
    el('div', { class: 'rec-lbl' }, label),
  );
}

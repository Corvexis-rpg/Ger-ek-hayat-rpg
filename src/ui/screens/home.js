// Ana Sayfa: karakter özeti, hatırlatmalar, seriler, günün ilerlemesi, günün görevleri.
import { el } from '../components/dom.js';
import { progressBar, statBar } from '../components/progressBar.js';
import * as store from '../../store.js';
import { MAIN_STATS, SECONDARY_STATS, statById } from '../../config/stats.js';
import { statLevelInfo } from '../../domain/xp.js';
import { characterInfo, deriveClass } from '../../domain/character.js';
import { effectiveStreak, effectiveMultiplier, OVERALL_KEY } from '../../domain/streaks.js';
import { titleForLevel, nextTitle } from '../../config/titles.js';
import { avatarById } from '../../config/rewards.js';
import { actionXp } from '../../domain/stats.js';
import { todayKey } from '../../services/time.js';
import { getReminders } from '../../services/reminders.js';
import { openQuickAdd } from '../actionForms.js';
import { questRow } from './quests.js';

export function renderHome() {
  const wrap = el('div', { class: 'page home' });
  const ch = store.state.character;
  const info = characterInfo(store.state.statProgress);
  const klass = deriveClass(store.state.statProgress);
  const title = ch.cosmeticTitleId ? cosmeticName(ch.cosmeticTitleId) : titleForLevel(info.level).name;
  const avatar = avatarById(ch.avatarId);
  const today = todayKey();
  const todaysActions = store.state.actions.filter((a) => a.day === today);
  const todayXp = todaysActions.reduce((s, a) => s + actionXp(a), 0);

  // --- karakter kartı ---
  wrap.appendChild(el('div', { class: 'card hero-card' },
    el('div', { class: 'hero-top' },
      el('div', { class: 'avatar-badge' }, avatar.emoji),
      el('div', { class: 'hero-id' },
        el('div', { class: 'hero-name' }, ch.name),
        el('div', { class: 'hero-sub' },
          el('span', { class: 'class-badge' }, klass.icon + ' ' + klass.name),
          el('span', { class: 'title-badge' }, title),
        ),
      ),
      el('div', { class: 'hero-level' },
        el('div', { class: 'lvl-num' }, info.level),
        el('div', { class: 'lvl-cap' }, 'Seviye'),
      ),
    ),
    el('div', { class: 'hero-xp' },
      progressBar(info.progress, { gradient: true, height: 12 }),
      el('div', { class: 'xp-caption' }, `${info.intoLevel} / ${info.needed} XP`),
    ),
  ));

  // --- nazik hatırlatmalar ---
  const reminders = getReminders();
  for (const r of reminders) {
    wrap.appendChild(el('div', { class: 'reminder' },
      el('span', { class: 'reminder-msg' }, r.message)));
  }

  // --- günün ilerlemesi ---
  const daily = store.dailyQuests();
  const doneCount = daily.filter((q) => q.done || q.status === 'completed').length;
  wrap.appendChild(el('div', { class: 'card day-card' },
    el('div', { class: 'day-stat' },
      el('div', { class: 'day-val' }, '⚡ ' + todayXp),
      el('div', { class: 'day-lbl' }, 'Bugünkü XP'),
    ),
    el('div', { class: 'day-stat' },
      el('div', { class: 'day-val' }, '📝 ' + todaysActions.length),
      el('div', { class: 'day-lbl' }, 'Eylem'),
    ),
    el('div', { class: 'day-stat' },
      el('div', { class: 'day-val' }, `✅ ${doneCount}/${daily.length}`),
      el('div', { class: 'day-lbl' }, 'Görev'),
    ),
  ));

  // --- büyük ekle butonu ---
  wrap.appendChild(el('button', { class: 'big-add', onclick: openQuickAdd },
    el('span', { class: 'big-add-plus' }, '+'),
    el('span', {}, 'Eylem Ekle'),
  ));

  // --- ana statlar ---
  const statsCard = el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, 'Ana Statlar')));
  for (const s of MAIN_STATS) {
    const p = store.state.statProgress[s.id];
    statsCard.appendChild(statBar(s, statLevelInfo(p.xp)));
  }
  wrap.appendChild(statsCard);

  // --- ikincil statlar (kompakt) ---
  const secCard = el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, 'İkincil Statlar')),
    el('div', { class: 'sec-grid' },
      ...SECONDARY_STATS.map((s) => {
        const p = store.state.statProgress[s.id];
        const li = statLevelInfo(p.xp);
        return el('div', { class: 'sec-item' },
          el('div', { class: 'sec-ic', style: { background: s.color + '22', color: s.color } }, s.icon),
          el('div', { class: 'sec-meta' },
            el('div', { class: 'sec-name' }, s.name),
            el('div', { class: 'sec-lvl' }, 'Sv ' + li.level),
          ),
        );
      })),
  );
  wrap.appendChild(secCard);

  // --- aktif seriler ---
  const streaks = activeStreaks();
  if (streaks.length) {
    wrap.appendChild(el('div', { class: 'card' },
      el('div', { class: 'card-head' }, el('h3', {}, '🔥 Aktif Seriler')),
      el('div', { class: 'streak-strip' },
        ...streaks.map((s) => el('div', { class: 'streak-pill' },
          el('span', { class: 'sp-icon' }, s.icon),
          el('span', { class: 'sp-days' }, s.days + ' gün'),
          el('span', { class: 'sp-name' }, s.name),
          s.mult > 1 ? el('span', { class: 'sp-mult' }, '×' + s.mult) : null,
        )),
      ),
    ));
  }

  // --- günün görevleri ---
  const questCard = el('div', { class: 'card' },
    el('div', { class: 'card-head' },
      el('h3', {}, '📜 Günün Görevleri'),
      el('a', { class: 'link', href: '#/quests' }, 'Tümü →')));
  if (daily.length) daily.slice(0, 3).forEach((q) => questCard.appendChild(questRow(q)));
  else questCard.appendChild(el('p', { class: 'muted' }, 'Bugün için görev yok.'));
  wrap.appendChild(questCard);

  return wrap;
}

function activeStreaks() {
  const today = todayKey();
  const out = [];
  const tm = store.typeMap();
  // genel aktiflik serisi başa
  const overall = store.state.streaks[OVERALL_KEY];
  const od = effectiveStreak(overall, today);
  if (od > 0) out.push({ icon: '⚡', name: 'Aktiflik', days: od, mult: 1, overall: true });
  for (const [key, s] of Object.entries(store.state.streaks)) {
    if (key === OVERALL_KEY) continue;
    const d = effectiveStreak(s, today);
    if (d > 0 && tm[key]) out.push({ icon: tm[key].icon, name: tm[key].name, days: d, mult: effectiveMultiplier(s, today) });
  }
  return out.sort((a, b) => (b.overall ? 1 : 0) - (a.overall ? 1 : 0) || b.days - a.days).slice(0, 8);
}

function cosmeticName(id) {
  const map = { demir_irade: 'Demir İradeli', gece_kusu: 'Gece Kuşu', denge_ustasi: 'Denge Ustası' };
  return map[id] || '';
}

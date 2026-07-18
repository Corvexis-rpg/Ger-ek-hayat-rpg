// Eylemler: hızlı ekleme grid'i, yönetim, kategori filtresi, aranabilir geçmiş (sanal liste).
import { el, haptic } from '../components/dom.js';
import { virtualList } from '../components/virtualList.js';
import { confirmDialog } from '../components/sheet.js';
import { showToast } from '../components/toast.js';
import * as store from '../../store.js';
import { CATEGORIES, CATEGORY_MAP } from '../../config/quickActions.js';
import { statById } from '../../config/stats.js';
import { effectiveStreak } from '../../domain/streaks.js';
import { actionXp } from '../../domain/stats.js';
import { todayKey, relativeTime, formatTime, formatDayLong } from '../../services/time.js';
import { openActionDetail, openCustomActionForm } from '../actionForms.js';

// ekranlar arası korunacak geçici durum
const ui = { category: 'all', search: '', manage: false, histView: 'liste' };

export function renderActions() {
  const wrap = el('div', { class: 'page actions' });
  wrap.appendChild(el('div', { class: 'page-head' },
    el('h1', {}, 'Eylemler'),
    el('div', { class: 'head-actions' },
      el('button', { class: 'btn tiny ghost', onclick: () => { ui.manage = !ui.manage; rerender(); } },
        ui.manage ? '✓ Bitti' : '⚙️ Yönet'),
      el('button', { class: 'btn tiny primary', onclick: () => openCustomActionForm() }, '✨ Özel'),
    ),
  ));

  // kategori filtresi
  const filterRow = el('div', { class: 'filter-row' });
  const cats = [{ id: 'all', name: 'Tümü', icon: '🌟' }, ...CATEGORIES];
  for (const c of cats) {
    filterRow.appendChild(el('button', {
      class: 'filter-chip' + (ui.category === c.id ? ' active' : ''),
      onclick: () => { ui.category = c.id; rerender(); },
    }, `${c.icon} ${c.name}`));
  }
  wrap.appendChild(filterRow);

  // hızlı ekle grid
  const types = store.state.actionTypes
    .filter((t) => ui.category === 'all' || t.category === ui.category)
    .sort((a, b) => (b.isFavorite - a.isFavorite) || (b.uses || 0) - (a.uses || 0));

  const grid = el('div', { class: 'action-grid' });
  if (!types.length) grid.appendChild(el('p', { class: 'muted' }, 'Bu kategoride eylem yok.'));
  for (const t of types) grid.appendChild(actionCard(t));
  wrap.appendChild(el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, ui.manage ? 'Eylem Türlerini Yönet' : 'Hızlı Ekle'),
      !ui.manage ? el('span', { class: 'muted small' }, 'Dokun → kaydet') : null),
    grid,
  ));

  // geçmiş
  const histBody = el('div', { class: 'hist-body' });
  const seg = el('div', { class: 'seg' },
    el('button', { class: 'seg-btn' + (ui.histView === 'liste' ? ' active' : ''), onclick: () => { ui.histView = 'liste'; renderHistBody(); toggleSeg(); } }, '📋 Liste'),
    el('button', { class: 'seg-btn' + (ui.histView === 'gunluk' ? ' active' : ''), onclick: () => { ui.histView = 'gunluk'; renderHistBody(); toggleSeg(); } }, '📅 Günlük'),
  );
  function toggleSeg() { [...seg.children].forEach((c, i) => c.classList.toggle('active', (i === 0) === (ui.histView === 'liste'))); }

  const searchInput = el('input', { class: 'input search', type: 'search', placeholder: '🔎 Eylem veya not ara…',
    value: ui.search, oninput: (e) => { ui.search = e.target.value; renderHistBody(); } });

  let vlist = null;
  function renderHistBody() {
    histBody.replaceChildren();
    const items = historyItems();
    if (ui.histView === 'liste') {
      vlist = virtualList({
        items, itemHeight: 72, renderItem: historyRow,
        emptyNode: el('div', { class: 'empty-hist muted' }, 'Henüz eylem yok. İlk adımını at! 🌱'),
      });
      histBody.appendChild(vlist.el);
    } else {
      histBody.appendChild(dayGroupedView(items));
    }
  }

  const histCard = el('div', { class: 'card history-card' },
    el('div', { class: 'card-head' }, el('h3', {}, 'Geçmiş')),
    seg, searchInput, histBody,
  );
  wrap.appendChild(histCard);
  renderHistBody();

  function rerender() {
    const parent = wrap.parentNode;
    if (!parent) return;
    const fresh = renderActions();
    parent.replaceChild(fresh, wrap);
  }

  return wrap;
}

function actionCard(t) {
  const streak = effectiveStreak(store.state.streaks[t.id], todayKey());
  if (ui.manage) {
    return el('div', { class: 'action-card manage' },
      el('span', { class: 'ac-icon' }, t.icon),
      el('span', { class: 'ac-name' }, t.name),
      el('div', { class: 'ac-tools' },
        el('button', { class: 'icon-btn', title: 'Favori', onclick: () => store.toggleFavorite(t.id) },
          t.isFavorite ? '⭐' : '☆'),
        t.isCustom ? el('button', { class: 'icon-btn', title: 'Düzenle', onclick: () => openCustomActionForm(t) }, '✏️') : null,
        t.isCustom ? el('button', { class: 'icon-btn danger-ghost', title: 'Sil', onclick: async () => {
          if (await confirmDialog({ title: 'Eylemi sil', message: `"${t.name}" silinsin mi? Geçmiş kayıtları kalır.`, confirmText: 'Sil', danger: true }))
            store.deleteActionType(t.id);
        } }, '🗑') : null,
      ),
    );
  }
  return el('button', {
    class: 'action-card', onclick: () => openActionDetail(t.id),
  },
    t.isFavorite ? el('span', { class: 'ac-fav' }, '⭐') : null,
    el('span', { class: 'ac-icon' }, t.icon),
    el('span', { class: 'ac-name' }, t.name),
    streak > 0 ? el('span', { class: 'ac-streak' }, '🔥' + streak) : null,
  );
}

function dayGroupedView(items) {
  if (!items.length) return el('div', { class: 'empty-hist muted' }, 'Kayıt yok. İlk adımını at! 🌱');
  const cap = 200;
  const shown = items.slice(0, cap);
  const groups = [];
  let cur = null;
  for (const a of shown) {
    if (!cur || cur.day !== a.day) { cur = { day: a.day, list: [] }; groups.push(cur); }
    cur.list.push(a);
  }
  const frag = el('div', { class: 'day-groups' });
  for (const g of groups) {
    const total = g.list.reduce((s, a) => s + actionXp(a), 0);
    frag.appendChild(el('div', { class: 'day-group' },
      el('div', { class: 'day-group-head' },
        el('span', { class: 'dg-date' }, formatDayLong(g.day)),
        el('span', { class: 'dg-sum' }, `${g.list.length} eylem · ⚡ ${total}`)),
      el('div', { class: 'day-group-list' }, ...g.list.map(historyRow)),
    ));
  }
  if (items.length > cap) frag.appendChild(el('div', { class: 'muted small center', style: { padding: '10px' } }, `Son ${cap} eylem gösteriliyor.`));
  return frag;
}

function historyItems() {
  const q = ui.search.trim().toLowerCase();
  const tm = store.typeMap();
  return store.state.actions.filter((a) => {
    const t = tm[a.actionTypeId];
    if (ui.category !== 'all' && (!t || t.category !== ui.category)) return false;
    if (!q) return true;
    const name = (t ? t.name : '').toLowerCase();
    const note = (a.note || '').toLowerCase();
    return name.includes(q) || note.includes(q);
  });
}

function historyRow(a) {
  const tm = store.typeMap();
  const t = tm[a.actionTypeId];
  const xp = actionXp(a);
  const cat = t ? CATEGORY_MAP[t.category] : null;
  const dur = a.detail && a.detail.duration ? `${a.detail.duration} dk` : '';
  const sub = [dur, a.note].filter(Boolean).join(' · ') || (cat ? cat.name : '');
  const subMuted = !dur && !a.note;
  return el('div', { class: 'hist-row' },
    el('span', { class: 'hist-ic' }, t ? t.icon : '❔'),
    el('div', { class: 'hist-main' },
      el('div', { class: 'hist-name' }, t ? t.name : 'Silinmiş eylem',
        a.multiplierApplied > 1 ? el('span', { class: 'hist-mult' }, ' ×' + a.multiplierApplied) : null),
      el('div', { class: 'hist-note' + (subMuted ? ' muted' : '') }, sub),
    ),
    el('div', { class: 'hist-right' },
      el('span', { class: 'hist-xp' }, '+' + xp),
      el('span', { class: 'hist-time' }, relativeTime(a.timestamp)),
    ),
  );
}

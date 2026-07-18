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
import { todayKey, relativeTime, formatTime } from '../../services/time.js';
import { logNow, openCustomActionForm, openLogWithNote } from '../actionForms.js';

// ekranlar arası korunacak geçici durum
const ui = { category: 'all', search: '', manage: false };

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
  const histCard = el('div', { class: 'card history-card' },
    el('div', { class: 'card-head' }, el('h3', {}, 'Geçmiş')),
    el('input', { class: 'input search', type: 'search', placeholder: '🔎 Eylem veya not ara…',
      value: ui.search, oninput: (e) => { ui.search = e.target.value; vlist.refresh(historyItems()); } }),
  );
  const vlist = virtualList({
    items: historyItems(), itemHeight: 72, renderItem: historyRow,
    emptyNode: el('div', { class: 'empty-hist muted' }, 'Henüz eylem yok. İlk adımını at! 🌱'),
  });
  histCard.appendChild(vlist.el);
  wrap.appendChild(histCard);

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
    class: 'action-card', onclick: async (ev) => {
      const btn = ev.currentTarget;
      const res = await logNow(t.id);
      if (res.ok) { btn.classList.add('pulse'); setTimeout(() => btn.classList.remove('pulse'), 400); }
    },
    oncontextmenu: (e) => { e.preventDefault(); openLogWithNote(t.id); },
  },
    t.isFavorite ? el('span', { class: 'ac-fav' }, '⭐') : null,
    el('span', { class: 'ac-icon' }, t.icon),
    el('span', { class: 'ac-name' }, t.name),
    streak > 0 ? el('span', { class: 'ac-streak' }, '🔥' + streak) : null,
  );
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
  return el('div', { class: 'hist-row' },
    el('span', { class: 'hist-ic' }, t ? t.icon : '❔'),
    el('div', { class: 'hist-main' },
      el('div', { class: 'hist-name' }, t ? t.name : 'Silinmiş eylem',
        a.multiplierApplied > 1 ? el('span', { class: 'hist-mult' }, ' ×' + a.multiplierApplied) : null),
      a.note ? el('div', { class: 'hist-note' }, a.note)
        : el('div', { class: 'hist-note muted' }, cat ? cat.name : ''),
    ),
    el('div', { class: 'hist-right' },
      el('span', { class: 'hist-xp' }, '+' + xp),
      el('span', { class: 'hist-time' }, relativeTime(a.timestamp)),
    ),
  );
}

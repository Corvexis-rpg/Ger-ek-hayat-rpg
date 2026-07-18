// Günlük plan / rutin: "Bugünün Planı" kartı ve düzenleyici.
import { el, haptic } from './components/dom.js';
import { openSheet, close } from './components/sheet.js';
import { showToast } from './components/toast.js';
import * as store from '../store.js';
import { CATEGORIES } from '../config/quickActions.js';
import { openActionDetail } from './actionForms.js';
import { todayKey } from '../services/time.js';

export const PARTS = [
  { id: 'sabah', name: 'Sabah', icon: '🌅' },
  { id: 'ogle', name: 'Öğlen', icon: '☀️' },
  { id: 'aksam', name: 'Akşam', icon: '🌙' },
  { id: 'genel', name: 'Gün boyu', icon: '📌' },
];
const PART_MAP = Object.fromEntries(PARTS.map((p) => [p.id, p]));

function doneToday(actionTypeId) {
  const today = todayKey();
  return store.state.actions.some((a) => a.actionTypeId === actionTypeId && a.day === today);
}

export function planCard() {
  const routine = store.getRoutine();
  const tm = store.typeMap();

  const head = el('div', { class: 'card-head' },
    el('h3', {}, '🗓️ Bugünün Planı'),
    el('button', { class: 'btn tiny ghost', onclick: openRoutineEditor }, routine.length ? 'Düzenle' : ''));

  if (!routine.length) {
    return el('div', { class: 'card plan-card' }, head,
      el('div', { class: 'plan-empty' },
        el('p', { class: 'muted' }, 'Kendi günlük rutinini oluştur — her gün ne yapacağın net olsun, düzenli ilerle.'),
        el('button', { class: 'btn primary full', onclick: openRoutineEditor }, '＋ Plan oluştur')));
  }

  const validItems = routine.filter((r) => tm[r.actionTypeId]);
  const doneCount = validItems.filter((r) => doneToday(r.actionTypeId)).length;
  const card = el('div', { class: 'card plan-card' }, head,
    el('div', { class: 'plan-progress-cap' }, `${doneCount}/${validItems.length} tamamlandı`));

  for (const part of PARTS) {
    const items = validItems.filter((r) => r.part === part.id);
    if (!items.length) continue;
    card.appendChild(el('div', { class: 'plan-part-label' }, `${part.icon} ${part.name}`));
    for (const r of items) {
      const t = tm[r.actionTypeId];
      const done = doneToday(r.actionTypeId);
      card.appendChild(el('button', { class: 'plan-item' + (done ? ' done' : ''),
        onclick: () => { haptic(10); openActionDetail(r.actionTypeId); } },
        el('span', { class: 'plan-check' }, done ? '✅' : '⬜'),
        el('span', { class: 'plan-ic' }, t.icon),
        el('span', { class: 'plan-name' }, t.name),
      ));
    }
  }
  return card;
}

export function openRoutineEditor() {
  openSheet({
    title: 'Günlük Planım',
    body: (content) => {
      const tm = store.typeMap();
      const listWrap = el('div', { class: 'routine-list' });

      function paintList() {
        listWrap.replaceChildren();
        const routine = store.getRoutine();
        if (!routine.length) {
          listWrap.appendChild(el('p', { class: 'muted small', style: { padding: '8px 0' } }, 'Henüz plan öğesi yok. Aşağıdan ekle.'));
          return;
        }
        for (const part of PARTS) {
          const items = routine.filter((r) => r.part === part.id && tm[r.actionTypeId]);
          if (!items.length) continue;
          listWrap.appendChild(el('div', { class: 'plan-part-label' }, `${part.icon} ${part.name}`));
          for (const r of items) {
            const t = tm[r.actionTypeId];
            listWrap.appendChild(el('div', { class: 'routine-item' },
              el('span', { class: 'plan-ic' }, t.icon),
              el('span', { class: 'plan-name grow' }, t.name),
              el('button', { class: 'icon-btn danger-ghost', onclick: async () => { await store.removeRoutineItem(r.id); paintList(); } }, '🗑')));
          }
        }
      }
      paintList();

      // ekleme formu
      const model = { actionTypeId: store.state.actionTypes[0] && store.state.actionTypes[0].id, part: 'sabah' };
      const typeSelect = el('select', { class: 'input', onchange: (e) => model.actionTypeId = e.target.value },
        ...CATEGORIES.map((c) => {
          const opts = store.state.actionTypes.filter((t) => t.category === c.id);
          if (!opts.length) return null;
          return el('optgroup', { label: `${c.icon} ${c.name}` },
            ...opts.map((t) => el('option', { value: t.id }, `${t.icon} ${t.name}`)));
        }).filter(Boolean));
      const partSelect = el('select', { class: 'input', onchange: (e) => model.part = e.target.value },
        ...PARTS.map((p) => el('option', { value: p.id }, `${p.icon} ${p.name}`)));

      content.append(
        listWrap,
        el('div', { class: 'divider' }),
        el('label', { class: 'field-label' }, 'Plana eylem ekle'),
        typeSelect,
        el('div', { class: 'field-2col', style: { marginTop: '10px' } },
          el('div', { class: 'grow' }, el('label', { class: 'field-label' }, 'Zaman dilimi'), partSelect),
          el('button', { class: 'btn primary', style: { alignSelf: 'flex-end', height: '46px' }, onclick: async () => {
            if (!model.actionTypeId) return;
            await store.addRoutineItem(model.actionTypeId, model.part);
            paintList();
            showToast('Plana eklendi 🗓️', 'success');
          } }, 'Ekle'),
        ),
        el('button', { class: 'btn ghost full', style: { marginTop: '16px' }, onclick: close }, 'Kapat'),
      );
    },
  });
}

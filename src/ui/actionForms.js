// Eylem ekleme akışları: hızlı ekleme, notla ekleme, özel eylem oluşturma/düzenleme.
import { el, haptic } from './components/dom.js';
import { openSheet, close } from './components/sheet.js';
import { showToast } from './components/toast.js';
import * as store from '../store.js';
import { STATS, MAIN_STATS, SECONDARY_STATS, statById } from '../config/stats.js';
import { CATEGORIES, ICON_CHOICES } from '../config/quickActions.js';
import { effectiveStreak } from '../domain/streaks.js';
import { todayKey } from '../services/time.js';

export async function logNow(typeId, note) {
  const res = await store.logAction(typeId, { note });
  if (res.ok) haptic(15);
  return res;
}

// Hızlı ekleme sayfası: favoriler + not alanı + özel oluştur
export function openQuickAdd() {
  openSheet({
    title: 'Eylem Ekle',
    body: (content) => {
      let note = '';
      const noteInput = el('input', {
        class: 'input', type: 'text', maxlength: 120,
        placeholder: 'İsteğe bağlı kısa not…',
        oninput: (e) => { note = e.target.value; },
      });

      const grid = el('div', { class: 'qa-grid' });
      const favs = store.favoriteActionTypes();
      const list = favs.length ? favs : store.state.actionTypes.slice(0, 8);
      for (const t of list) grid.appendChild(quickChip(t, () => note, noteInput));

      content.append(
        el('label', { class: 'field-label' }, 'Not (opsiyonel)'),
        noteInput,
        el('div', { class: 'section-label' }, 'Favori eylemler'),
        grid,
        el('button', { class: 'btn ghost full', style: { marginTop: '14px' },
          onclick: () => { close(); openCustomActionForm(); } }, '✨ Özel eylem oluştur'),
        el('button', { class: 'btn ghost full', style: { marginTop: '8px' },
          onclick: () => { close(); location.hash = '#/actions'; } }, 'Tüm eylemleri gör →'),
      );
    },
  });
}

function quickChip(t, getNote, noteInput) {
  const streak = effectiveStreak(store.state.streaks[t.id], todayKey());
  return el('button', {
    class: 'qa-chip', onclick: async (ev) => {
      const btn = ev.currentTarget;
      const res = await logNow(t.id, getNote());
      if (res.ok) {
        if (noteInput) noteInput.value = '';
        btn.classList.add('pulse'); setTimeout(() => btn.classList.remove('pulse'), 400);
      }
    },
  },
    el('span', { class: 'qa-icon' }, t.icon),
    el('span', { class: 'qa-name' }, t.name),
    streak > 0 ? el('span', { class: 'qa-streak' }, '🔥' + streak) : null,
  );
}

// Notla ekleme (tek eylem)
export function openLogWithNote(typeId) {
  const t = store.state.actionTypes.find((x) => x.id === typeId);
  if (!t) return;
  openSheet({
    title: t.icon + ' ' + t.name,
    body: (content) => {
      let note = '';
      content.append(
        el('label', { class: 'field-label' }, 'Not (opsiyonel)'),
        el('textarea', { class: 'input', rows: 3, maxlength: 200, placeholder: 'Bu eylem hakkında bir not…',
          oninput: (e) => { note = e.target.value; } }),
        el('div', { class: 'award-preview' },
          ...t.awards.map((a) => {
            const s = statById(a.statId);
            return el('span', { class: 'chip mini', style: { color: s.color } }, `${s.icon} +${a.xp}`);
          })),
        el('div', { class: 'row-actions', style: { marginTop: '16px' } },
          el('button', { class: 'btn ghost', onclick: close }, 'Vazgeç'),
          el('button', { class: 'btn primary', onclick: async () => { await logNow(typeId, note); close(); } }, 'Kaydet'),
        ),
      );
    },
  });
}

// Özel eylem oluşturma / düzenleme
export function openCustomActionForm(existing = null) {
  openSheet({
    title: existing ? 'Eylemi Düzenle' : 'Özel Eylem',
    body: (content) => {
      const model = {
        name: existing ? existing.name : '',
        icon: existing ? existing.icon : '✨',
        category: existing ? existing.category : 'diger',
        dailyLimit: existing && existing.dailyLimit ? existing.dailyLimit : '',
        awards: {},
      };
      if (existing) for (const a of existing.awards) model.awards[a.statId] = a.xp;
      else model.awards['beden'] = 15;

      const nameInput = el('input', { class: 'input', type: 'text', maxlength: 40, value: model.name,
        placeholder: 'Örn: Yoga yaptım', oninput: (e) => { model.name = e.target.value; } });

      // ikon seçici
      const iconBtn = el('button', { class: 'icon-pick' }, model.icon);
      const iconGrid = el('div', { class: 'icon-grid hidden' });
      for (const ic of ICON_CHOICES) {
        iconGrid.appendChild(el('button', { class: 'icon-opt', onclick: () => {
          model.icon = ic; iconBtn.textContent = ic; iconGrid.classList.add('hidden');
        } }, ic));
      }
      iconBtn.addEventListener('click', () => iconGrid.classList.toggle('hidden'));

      // kategori seçici
      const catSelect = el('select', { class: 'input', onchange: (e) => { model.category = e.target.value; } },
        ...CATEGORIES.map((c) => el('option', { value: c.id, selected: c.id === model.category }, `${c.icon} ${c.name}`)));

      // stat + xp seçici
      const statList = el('div', { class: 'stat-award-list' });
      function statRow(stat) {
        const active = model.awards[stat.id] != null;
        const xpVal = model.awards[stat.id] || 15;
        const chk = el('input', { type: 'checkbox', checked: active });
        const xpInput = el('input', { class: 'input xp-input', type: 'number', min: 1, max: 100, value: xpVal,
          disabled: !active, oninput: (e) => { model.awards[stat.id] = Math.max(1, +e.target.value || 1); } });
        chk.addEventListener('change', () => {
          if (chk.checked) { model.awards[stat.id] = +xpInput.value || 15; xpInput.disabled = false; }
          else { delete model.awards[stat.id]; xpInput.disabled = true; }
        });
        return el('label', { class: 'stat-award-row' },
          el('span', { class: 'saw-name', style: { color: stat.color } }, `${stat.icon} ${stat.name}`),
          el('span', { class: 'saw-controls' }, chk, xpInput),
        );
      }
      MAIN_STATS.forEach((s) => statList.appendChild(statRow(s)));
      SECONDARY_STATS.forEach((s) => statList.appendChild(statRow(s)));

      const limitInput = el('input', { class: 'input', type: 'number', min: 1, max: 50, value: model.dailyLimit,
        placeholder: 'Sınırsız', oninput: (e) => { model.dailyLimit = e.target.value; } });

      const err = el('div', { class: 'form-error hidden' });

      content.append(
        el('label', { class: 'field-label' }, 'Eylem adı'),
        nameInput,
        el('div', { class: 'field-2col' },
          el('div', {}, el('label', { class: 'field-label' }, 'İkon'), iconBtn),
          el('div', { class: 'grow' }, el('label', { class: 'field-label' }, 'Kategori'), catSelect),
        ),
        iconGrid,
        el('label', { class: 'field-label' }, 'Hangi statlara XP versin?'),
        statList,
        el('label', { class: 'field-label' }, 'Günlük tekrar limiti (opsiyonel)'),
        limitInput,
        err,
        el('div', { class: 'row-actions', style: { marginTop: '16px' } },
          el('button', { class: 'btn ghost', onclick: close }, 'Vazgeç'),
          el('button', { class: 'btn primary', onclick: async () => {
            const awards = Object.entries(model.awards).map(([statId, xp]) => ({ statId, xp }));
            if (!model.name.trim()) { err.textContent = 'Bir isim gir.'; err.classList.remove('hidden'); return; }
            if (!awards.length) { err.textContent = 'En az bir stat seç.'; err.classList.remove('hidden'); return; }
            const payload = {
              name: model.name.trim(), icon: model.icon, category: model.category, awards,
              dailyLimit: model.dailyLimit ? Math.max(1, +model.dailyLimit) : null,
            };
            if (existing) await store.updateActionType(existing.id, payload);
            else await store.createActionType(payload);
            showToast(existing ? 'Eylem güncellendi' : 'Özel eylem oluşturuldu 🛠️', 'success');
            close();
          } }, existing ? 'Kaydet' : 'Oluştur'),
        ),
      );
    },
  });
}

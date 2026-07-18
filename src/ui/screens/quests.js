// Görevler: yan görev, günlük, haftalık, uzun vadeli hedefler.
import { el, haptic } from '../components/dom.js';
import { progressBar } from '../components/progressBar.js';
import { openSheet, close, confirmDialog } from '../components/sheet.js';
import { showToast } from '../components/toast.js';
import * as store from '../../store.js';
import { statById, STATS } from '../../config/stats.js';
import { CATEGORIES, ICON_CHOICES } from '../../config/quickActions.js';

export function questRow(q, { deletable = false } = {}) {
  const reward = q.reward ? statById(q.reward.statId) : null;
  const done = q.done || q.status === 'completed';
  const isManual = q.criteria && q.criteria.kind === 'manual';

  let right;
  if (done) right = el('span', { class: 'quest-check' }, '✓');
  else if (isManual) right = el('button', { class: 'btn tiny primary', onclick: async () => {
    haptic(15); await store.completeManualQuest(q.id);
  } }, 'Yaptım');
  else right = el('span', { class: 'quest-frac' }, `${q.progress}/${q.target}`);

  const children = [
    el('div', { class: 'quest-ic' }, q.icon),
    el('div', { class: 'quest-main' },
      el('div', { class: 'quest-title' }, q.title),
      isManual && !done ? null : progressBar((q.target ? q.progress / q.target : 0), { gradient: true, height: 6 }),
      el('div', { class: 'quest-meta' },
        reward ? el('span', { class: 'chip mini', style: { color: reward.color } }, `${reward.icon} +${q.reward.xp} XP`) : null,
        q.fixed ? el('span', { class: 'chip mini fixed-chip' }, '📌 sabit') : null,
      ),
    ),
    el('div', { class: 'quest-right' }, right,
      deletable ? el('button', { class: 'icon-btn danger-ghost', onclick: async () => {
        if (await confirmDialog({ title: 'Hedefi sil', message: `"${q.title}" hedefini silmek istiyor musun?`, confirmText: 'Sil', danger: true }))
          store.deleteQuest(q.id);
      } }, '🗑') : null,
    ),
  ];
  return el('div', { class: 'quest-row' + (done ? ' done' : '') }, ...children);
}

export function renderQuests() {
  const wrap = el('div', { class: 'page quests' });
  wrap.appendChild(el('div', { class: 'page-head' }, el('h1', {}, 'Görevler')));

  let tab = 'gunluk';
  const tabs = el('div', { class: 'tabs' });
  const body = el('div', { class: 'tab-body' });
  const TABS = [{ id: 'gunluk', label: 'Günlük' }, { id: 'haftalik', label: 'Haftalık' }, { id: 'hedef', label: 'Hedefler' }];

  function renderBody() {
    body.replaceChildren();
    if (tab === 'gunluk') {
      const side = store.sideQuest();
      if (side) {
        body.appendChild(el('div', { class: 'card side-quest' },
          el('div', { class: 'side-tag' }, '🎲 Yan Görev'),
          questRow(side)));
      }
      const daily = store.dailyQuests();
      const card = el('div', { class: 'card' }, el('div', { class: 'card-head' }, el('h3', {}, 'Günlük Görevler')));
      if (daily.length) daily.forEach((q) => card.appendChild(questRow(q)));
      else card.appendChild(el('p', { class: 'muted' }, 'Görev üretiliyor…'));
      body.appendChild(card);
      body.appendChild(el('button', { class: 'btn ghost full', onclick: () => openTemplateForm('day') }, '＋ Kendi günlük görevini ekle'));
    } else if (tab === 'haftalik') {
      const weekly = store.weeklyQuests();
      const card = el('div', { class: 'card' }, el('div', { class: 'card-head' }, el('h3', {}, 'Haftalık Görevler')));
      if (weekly.length) weekly.forEach((q) => card.appendChild(questRow(q)));
      else card.appendChild(el('p', { class: 'muted' }, 'Görev üretiliyor…'));
      body.appendChild(card);
      body.appendChild(el('button', { class: 'btn ghost full', onclick: () => openTemplateForm('week') }, '＋ Kendi haftalık görevini ekle'));
    } else {
      const goals = store.goals();
      const card = el('div', { class: 'card' }, el('div', { class: 'card-head' }, el('h3', {}, 'Uzun Vadeli Hedefler')));
      if (goals.length) goals.forEach((q) => card.appendChild(questRow(q, { deletable: true })));
      else card.appendChild(el('p', { class: 'muted' }, 'Henüz hedefin yok. Büyük bir hayal kur! 🎯'));
      body.appendChild(card);
      body.appendChild(el('button', { class: 'btn primary full', onclick: openGoalForm }, '＋ Yeni hedef oluştur'));
    }
  }

  TABS.forEach((t) => {
    const b = el('button', { class: 'tab' + (t.id === tab ? ' active' : ''), onclick: () => {
      tab = t.id;
      [...tabs.children].forEach((c) => c.classList.toggle('active', c.dataset.id === tab));
      renderBody();
    }, dataset: { id: t.id } }, t.label);
    tabs.appendChild(b);
  });

  wrap.append(tabs, body);
  renderBody();
  return wrap;
}

// Hedef oluşturma
function openGoalForm() {
  openSheet({
    title: 'Yeni Hedef',
    body: (content) => {
      const model = { title: '', icon: '🎯', kind: 'action_count', actionTypeId: '', target: 30 };
      const nameInput = el('input', { class: 'input', maxlength: 50, placeholder: 'Örn: 30 gün her gün spor',
        oninput: (e) => model.title = e.target.value });
      const typeSelect = el('select', { class: 'input', onchange: (e) => model.actionTypeId = e.target.value },
        el('option', { value: '' }, 'Herhangi bir eylem'),
        ...store.state.actionTypes.map((t) => el('option', { value: t.id }, `${t.icon} ${t.name}`)));
      const kindSelect = el('select', { class: 'input', onchange: (e) => model.kind = e.target.value },
        el('option', { value: 'action_count' }, 'Toplam sayı (kez)'),
        el('option', { value: 'streak' }, 'Üst üste gün (seri)'));
      const targetInput = el('input', { class: 'input', type: 'number', min: 1, max: 1000, value: 30,
        oninput: (e) => model.target = Math.max(1, +e.target.value || 1) });
      const err = el('div', { class: 'form-error hidden' });

      content.append(
        el('label', { class: 'field-label' }, 'Hedef adı'), nameInput,
        el('label', { class: 'field-label' }, 'İlgili eylem'), typeSelect,
        el('label', { class: 'field-label' }, 'Ölçü'), kindSelect,
        el('label', { class: 'field-label' }, 'Hedef değer'), targetInput,
        err,
        el('div', { class: 'row-actions', style: { marginTop: '16px' } },
          el('button', { class: 'btn ghost', onclick: close }, 'Vazgeç'),
          el('button', { class: 'btn primary', onclick: async () => {
            if (!model.title.trim()) { err.textContent = 'Bir isim gir.'; err.classList.remove('hidden'); return; }
            let criteria;
            if (model.kind === 'streak') {
              // seri hedefi: ilgili eylemde en uzun seri hedefe ulaşınca tamamlanır
              criteria = { kind: 'streak_goal', actionTypeId: model.actionTypeId || null, target: model.target };
            } else {
              const match = model.actionTypeId ? { actionTypeId: model.actionTypeId } : undefined;
              criteria = { kind: 'action_count', match, target: model.target };
            }
            await store.createGoal({ title: model.title.trim(), icon: model.icon,
              criteria, reward: { statId: 'disiplin', xp: Math.min(300, model.target * 4) } });
            showToast('Hedef oluşturuldu 🎯', 'success');
            close();
          } }, 'Oluştur'),
        ),
      );
    },
  });
}

// Kullanıcı görev şablonu (günlük/haftalık)
function openTemplateForm(period) {
  openSheet({
    title: period === 'day' ? 'Günlük Görev Ekle' : 'Haftalık Görev Ekle',
    body: (content) => {
      const model = { title: '', icon: '📌', category: '', actionTypeId: '', target: period === 'day' ? 1 : 3, rewardStat: 'disiplin', rewardXp: period === 'day' ? 15 : 70 };
      const nameInput = el('input', { class: 'input', maxlength: 50, placeholder: 'Örn: 2 sayfa yaz',
        oninput: (e) => model.title = e.target.value });
      const typeSelect = el('select', { class: 'input', onchange: (e) => model.actionTypeId = e.target.value },
        el('option', { value: '' }, 'Herhangi bir eylem'),
        ...store.state.actionTypes.map((t) => el('option', { value: t.id }, `${t.icon} ${t.name}`)));
      const targetInput = el('input', { class: 'input', type: 'number', min: 1, max: 100, value: model.target,
        oninput: (e) => model.target = Math.max(1, +e.target.value || 1) });
      const err = el('div', { class: 'form-error hidden' });
      content.append(
        el('label', { class: 'field-label' }, 'Görev adı'), nameInput,
        el('label', { class: 'field-label' }, 'İlgili eylem'), typeSelect,
        el('label', { class: 'field-label' }, period === 'day' ? 'Günlük hedef (kez)' : 'Haftalık hedef (kez)'), targetInput,
        err,
        el('div', { class: 'row-actions', style: { marginTop: '16px' } },
          el('button', { class: 'btn ghost', onclick: close }, 'Vazgeç'),
          el('button', { class: 'btn primary', onclick: async () => {
            if (!model.title.trim()) { err.textContent = 'Bir isim gir.'; err.classList.remove('hidden'); return; }
            const match = model.actionTypeId ? { actionTypeId: model.actionTypeId } : undefined;
            const criteria = match ? { kind: 'action_count', match, target: model.target } : { kind: 'any_action', target: model.target };
            await store.createTemplate({ title: model.title.trim(), icon: model.icon, period, criteria,
              reward: { statId: model.rewardStat, xp: model.rewardXp } });
            showToast('Görev eklendi 📌', 'success');
            close();
          } }, 'Ekle'),
        ),
      );
    },
  });
}

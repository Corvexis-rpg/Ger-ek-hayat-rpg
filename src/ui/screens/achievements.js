// Başarımlar: rozet galerisi (kilitli=siluet) + Envanter (kozmetik ödüller).
import { el } from '../components/dom.js';
import { showToast } from '../components/toast.js';
import * as store from '../../store.js';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from '../../config/achievements.js';
import { AVATARS, ACCENTS, COSMETIC_TITLES, FRAMES } from '../../config/rewards.js';
import { characterInfo } from '../../domain/character.js';

const ui = { tab: 'rozet' };

export function renderAchievements() {
  const wrap = el('div', { class: 'page achievements' });
  const unlockedCount = ACHIEVEMENTS.filter((a) => store.state.achievements[a.id]).length;
  wrap.appendChild(el('div', { class: 'page-head' },
    el('h1', {}, 'Başarımlar'),
    el('span', { class: 'muted' }, `${unlockedCount}/${ACHIEVEMENTS.length}`)));

  const tabs = el('div', { class: 'tabs' });
  [['rozet', '🏅 Rozetler'], ['envanter', '🎒 Envanter']].forEach(([id, label]) => {
    tabs.appendChild(el('button', { class: 'tab' + (ui.tab === id ? ' active' : ''),
      onclick: () => { ui.tab = id; rerender(); } }, label));
  });
  wrap.appendChild(tabs);

  if (ui.tab === 'rozet') wrap.appendChild(renderBadges());
  else wrap.appendChild(renderInventory());

  function rerender() { const p = wrap.parentNode; if (p) p.replaceChild(renderAchievements(), wrap); }
  return wrap;
}

function renderBadges() {
  const frag = el('div', {});
  for (const cat of ACHIEVEMENT_CATEGORIES) {
    const items = ACHIEVEMENTS.filter((a) => a.category === cat.id);
    if (!items.length) continue;
    const grid = el('div', { class: 'badge-grid' });
    for (const a of items) {
      const unlocked = store.state.achievements[a.id];
      grid.appendChild(el('div', { class: 'badge' + (unlocked ? ' unlocked' : ' locked') },
        el('div', { class: 'badge-ic' }, unlocked ? a.icon : '❔'),
        el('div', { class: 'badge-name' }, unlocked ? a.name : '???'),
        el('div', { class: 'badge-desc' }, a.desc),
        unlocked ? el('div', { class: 'badge-date' }, '✓ Açıldı') : null,
      ));
    }
    frag.appendChild(el('div', { class: 'card' },
      el('div', { class: 'card-head' }, el('h3', {}, cat.name)), grid));
  }
  return frag;
}

function renderInventory() {
  const frag = el('div', {});
  const charLevel = characterInfo(store.state.statProgress).level;

  frag.appendChild(rewardSection('👤 Avatarlar', AVATARS, 'avatar',
    (r) => r.emoji, () => store.state.character.avatarId, charLevel));
  frag.appendChild(rewardSection('🎨 Tema Renkleri', ACCENTS, 'accent',
    (r) => el('span', { class: 'accent-dot', style: { background: `linear-gradient(135deg, ${r.color}, ${r.color2})` } }),
    () => store.settings().accent, charLevel));
  frag.appendChild(rewardSection('🖼️ Kart Çerçeveleri', FRAMES, 'frame',
    (r) => el('span', { class: 'frame-preview frame-' + r.id }, '🖼️'),
    () => store.state.character.frameId || 'none', charLevel));
  frag.appendChild(rewardSection('🏷️ Unvanlar', COSMETIC_TITLES, 'title',
    (r) => '🏷️', () => store.state.character.cosmeticTitleId, charLevel));

  return frag;
}

function rewardSection(title, list, kind, visual, currentFn, charLevel) {
  const grid = el('div', { class: 'reward-grid' });
  const current = currentFn();
  for (const r of list) {
    const unlocked = store.rewardUnlocked(r.id);
    const equipped = current === r.id;
    const vis = visual(r);
    const card = el('div', { class: 'reward-card' + (unlocked ? '' : ' locked') + (equipped ? ' equipped' : '') },
      el('div', { class: 'reward-vis' }, typeof vis === 'string' ? vis : vis),
      el('div', { class: 'reward-name' }, r.name),
      unlocked
        ? (equipped ? el('div', { class: 'reward-eq' }, '✓ Seçili')
          : el('button', { class: 'btn tiny primary', onclick: async () => { await store.equipReward(kind, r.id); showToast('Seçildi ✨', 'success'); } }, 'Seç'))
        : el('div', { class: 'reward-lock' }, lockText(r, charLevel)),
    );
    grid.appendChild(card);
  }
  return el('div', { class: 'card' }, el('div', { class: 'card-head' }, el('h3', {}, title)), grid);
}

function lockText(r, charLevel) {
  const u = r.unlock;
  if (u.type === 'level') return `🔒 Sv ${u.level}`;
  if (u.type === 'achievement') {
    const ach = ACHIEVEMENTS.find((a) => a.id === u.id);
    return `🔒 ${ach ? ach.name : 'Başarım'}`;
  }
  return '🔒';
}

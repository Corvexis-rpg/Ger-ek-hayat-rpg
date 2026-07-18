// İlk açılış: karakter oluşturma (isim + avatar).
import { el } from '../components/dom.js';
import * as store from '../../store.js';
import { AVATARS } from '../../config/rewards.js';
import { MAIN_STATS, SECONDARY_STATS } from '../../config/stats.js';
import { burst } from '../components/confetti.js';

export function renderOnboarding(onDone) {
  const wrap = el('div', { class: 'onboarding' });
  const model = { name: '', avatarId: 'mage' };

  const avatarGrid = el('div', { class: 'onb-avatars' });
  const defaults = AVATARS.filter((a) => a.unlock.type === 'default');
  function paint() {
    avatarGrid.replaceChildren(...defaults.map((a) =>
      el('button', { class: 'onb-avatar' + (model.avatarId === a.id ? ' active' : ''),
        onclick: () => { model.avatarId = a.id; paint(); } }, a.emoji)));
  }
  paint();

  wrap.append(
    el('div', { class: 'onb-hero' },
      el('div', { class: 'onb-logo' }, '⚔️'),
      el('h1', { class: 'onb-title' }, 'Gerçek Hayat RPG'),
      el('p', { class: 'onb-sub' }, 'Gerçek hayatını bir maceraya dönüştür. Her sağlıklı alışkanlık seni güçlendirir.')),

    el('div', { class: 'onb-card' },
      el('label', { class: 'field-label' }, 'Kahramanının adı'),
      el('input', { class: 'input', maxlength: 24, placeholder: 'Örn: Burak',
        oninput: (e) => { model.name = e.target.value; nextBtn.disabled = !model.name.trim(); } }),
      el('label', { class: 'field-label' }, 'Bir avatar seç'),
      avatarGrid),

    el('div', { class: 'onb-stats' },
      el('p', { class: 'muted small center' }, 'Geliştireceğin statlar:'),
      el('div', { class: 'onb-stat-row' },
        ...MAIN_STATS.map((s) => el('span', { class: 'chip mini', style: { color: s.color } }, `${s.icon} ${s.name}`)),
        ...SECONDARY_STATS.map((s) => el('span', { class: 'chip mini', style: { color: s.color } }, `${s.icon} ${s.name}`)))),
  );

  const nextBtn = el('button', { class: 'btn primary full big', disabled: true,
    onclick: async () => {
      await store.createCharacter({ name: model.name, avatarId: model.avatarId });
      await store.runMaintenance();
      burst({ count: 120, origin: { x: 0.5, y: 0.5 } });
      onDone();
    } }, 'Maceraya Başla →');
  wrap.appendChild(el('div', { class: 'onb-foot' }, nextBtn));

  return wrap;
}

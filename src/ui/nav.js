// Alt gezinme çubuğu.
import { el, haptic } from './components/dom.js';

export const NAV_ITEMS = [
  { route: 'home',         icon: '🏠', label: 'Ana Sayfa' },
  { route: 'actions',      icon: '➕', label: 'Eylemler' },
  { route: 'quests',       icon: '📜', label: 'Görevler' },
  { route: 'stats',        icon: '📊', label: 'İstatistik' },
  { route: 'achievements', icon: '🏅', label: 'Başarım' },
];

export function renderNav(current) {
  return el('nav', { class: 'bottom-nav' },
    ...NAV_ITEMS.map((item) =>
      el('a', {
        class: 'nav-item' + (item.route === current ? ' active' : ''),
        href: '#/' + item.route,
        onclick: () => haptic(8),
      },
        el('span', { class: 'nav-icon' }, item.icon),
        el('span', { class: 'nav-label' }, item.label),
      )),
  );
}

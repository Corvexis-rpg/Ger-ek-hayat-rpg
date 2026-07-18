// Tam ekran seviye atlama kutlaması.
import { el } from './dom.js';

let active = null;

export function showLevelUp({ level, word = 'SEVİYE', title = '', subtitle = '' }) {
  dismiss();
  const overlay = el('div', { class: 'level-overlay', onclick: dismiss },
    el('div', { class: 'level-pop' },
      el('div', { class: 'level-ring' },
        el('div', { class: 'level-word' }, word),
        el('div', { class: 'level-num' }, String(level)),
      ),
      title ? el('div', { class: 'level-title' }, title) : null,
      subtitle ? el('div', { class: 'level-sub' }, subtitle) : null,
      el('div', { class: 'level-hint' }, 'devam etmek için dokun'),
    ),
  );
  document.body.appendChild(overlay);
  active = overlay;
  requestAnimationFrame(() => overlay.classList.add('show'));
  active._timer = setTimeout(dismiss, 3000);
}

export function dismiss() {
  if (!active) return;
  const o = active; active = null;
  clearTimeout(o._timer);
  o.classList.remove('show');
  setTimeout(() => o.remove(), 350);
}

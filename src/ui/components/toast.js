// Uygulama içi kısa bildirim (toast).
import { el } from './dom.js';

let container;
function ensure() {
  if (container) return;
  container = el('div', { class: 'toast-container' });
  document.body.appendChild(container);
}

function capChildren(sel, max) {
  const items = container.querySelectorAll(sel);
  for (let i = 0; i <= items.length - max; i++) items[i].remove();
}

export function showToast(message, tone = 'info', timeout = 2600) {
  ensure();
  capChildren('.toast', 3);
  const t = el('div', { class: `toast toast-${tone}` }, message);
  container.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, timeout);
}

// Seviye atlama / başarım gibi büyük kutlama afişi
export function showBanner({ icon, title, subtitle, tone = 'accent' }) {
  ensure();
  capChildren('.banner', 3);
  const b = el('div', { class: `banner banner-${tone}` },
    el('div', { class: 'banner-icon' }, icon),
    el('div', { class: 'banner-text' },
      el('div', { class: 'banner-title' }, title),
      subtitle ? el('div', { class: 'banner-sub' }, subtitle) : null,
    ),
  );
  container.appendChild(b);
  requestAnimationFrame(() => b.classList.add('show'));
  setTimeout(() => {
    b.classList.remove('show');
    setTimeout(() => b.remove(), 400);
  }, 3200);
}

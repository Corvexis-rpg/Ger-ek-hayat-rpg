// Alttan açılan sayfa (bottom sheet) ve modal — tek elle kullanım için alt hizalı.
import { el, clear } from './dom.js';

let overlay, sheetEl, currentClose;

function ensure() {
  if (overlay) return;
  overlay = el('div', { class: 'sheet-overlay', onclick: (e) => { if (e.target === overlay) close(); } });
  sheetEl = el('div', { class: 'sheet' });
  overlay.appendChild(sheetEl);
  document.body.appendChild(overlay);
}

export function openSheet({ title, body, onClose } = {}) {
  ensure();
  clear(sheetEl);
  currentClose = onClose;
  const header = el('div', { class: 'sheet-header' },
    el('div', { class: 'sheet-handle' }),
    title ? el('div', { class: 'sheet-title-row' },
      el('h2', { class: 'sheet-title' }, title),
      el('button', { class: 'sheet-close', onclick: close, 'aria-label': 'Kapat' }, '✕'),
    ) : null,
  );
  const content = el('div', { class: 'sheet-body' });
  if (typeof body === 'function') body(content, close);
  else if (body) content.appendChild(body);
  sheetEl.append(header, content);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('open'));
  return close;
}

export function close() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { if (sheetEl) clear(sheetEl); }, 300);
  if (currentClose) { const fn = currentClose; currentClose = null; fn(); }
}

// Basit onay diyaloğu
export function confirmDialog({ title, message, confirmText = 'Onayla', danger = false }) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (val) => { if (settled) return; settled = true; resolve(val); };
    openSheet({
      title,
      body: (content) => {
        content.append(
          el('p', { class: 'muted', style: { marginBottom: '18px' } }, message),
          el('div', { class: 'row-actions' },
            el('button', { class: 'btn ghost', onclick: () => { finish(false); close(); } }, 'Vazgeç'),
            el('button', { class: `btn ${danger ? 'danger' : 'primary'}`, onclick: () => { finish(true); close(); } }, confirmText),
          ),
        );
      },
      onClose: () => finish(false),
    });
  });
}

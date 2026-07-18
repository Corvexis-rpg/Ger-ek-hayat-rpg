// Sanallaştırılmış liste — binlerce kayıtta akıcı render (sabit satır yüksekliği).
import { el } from './dom.js';

export function virtualList({ items, itemHeight = 68, renderItem, overscan = 8, emptyNode = null }) {
  const viewport = el('div', { class: 'vlist' });
  const spacer = el('div', { class: 'vlist-spacer' });
  viewport.appendChild(spacer);
  let data = items;
  const rendered = new Map();

  function layout() {
    spacer.style.height = (data.length * itemHeight) + 'px';
    if (!data.length && emptyNode) {
      spacer.appendChild(emptyNode);
    }
  }

  function update() {
    if (!data.length) return;
    const scroll = viewport.scrollTop;
    const h = viewport.clientHeight || 400;
    const start = Math.max(0, Math.floor(scroll / itemHeight) - overscan);
    const end = Math.min(data.length, Math.ceil((scroll + h) / itemHeight) + overscan);
    for (const [i, node] of rendered) {
      if (i < start || i >= end) { node.remove(); rendered.delete(i); }
    }
    for (let i = start; i < end; i++) {
      if (rendered.has(i)) continue;
      const node = renderItem(data[i], i);
      node.classList.add('vrow');
      node.style.top = (i * itemHeight) + 'px';
      node.style.height = itemHeight + 'px';
      spacer.appendChild(node);
      rendered.set(i, node);
    }
  }

  let ticking = false;
  viewport.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  });

  function refresh(newItems) {
    data = newItems;
    for (const [, node] of rendered) node.remove();
    rendered.clear();
    while (spacer.firstChild) spacer.removeChild(spacer.firstChild);
    layout();
    update();
  }

  layout();
  requestAnimationFrame(update);
  return { el: viewport, refresh, update };
}

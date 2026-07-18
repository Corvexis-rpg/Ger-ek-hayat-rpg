// Akıcı dolan ilerleme/XP çubuğu.
import { el } from './dom.js';

export function progressBar(value, { color, height = 10, from = null, gradient = false } = {}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const fill = el('div', { class: 'bar-fill' });
  if (gradient) fill.style.background = 'linear-gradient(90deg, var(--accent), var(--accent-2))';
  else if (color) fill.style.background = color;
  const bar = el('div', { class: 'bar', style: { height: height + 'px' } }, fill);
  const start = from != null ? Math.max(0, Math.min(1, from)) * 100 : pct;
  fill.style.width = start + '%';
  requestAnimationFrame(() => { requestAnimationFrame(() => { fill.style.width = pct + '%'; }); });
  return bar;
}

export function statBar(stat, info, { showLevel = true } = {}) {
  return el('div', { class: 'stat-row' },
    el('div', { class: 'stat-row-head' },
      el('span', { class: 'stat-name' }, el('span', { class: 'stat-ic' }, stat.icon), stat.name),
      showLevel ? el('span', { class: 'stat-lvl', style: { color: stat.color } }, 'Sv ' + info.level) : null,
    ),
    progressBar(info.progress, { color: stat.color, height: 8 }),
  );
}

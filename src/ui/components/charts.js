// Bağımlılıksız SVG grafikler: çizgi/alan, radar, çubuk. Uniform ölçek (metin/işaret bozulmaz).
import { svgEl, el } from './dom.js';
import { dayShort } from '../../services/time.js';

let _uid = 0;
const nid = () => 'g' + (_uid++);

function svgRoot(W, H) {
  const s = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: 'xMidYMid meet', class: 'chart',
  });
  s.style.display = 'block';
  s.style.width = '100%';
  s.style.height = 'auto';
  return s;
}

// series: [{day, value}]
export function lineChart(series, { color = 'var(--accent)', area = true, W = 340, H = 150 } = {}) {
  const s = svgRoot(W, H);
  const padL = 8, padR = 8, padT = 12, padB = 20;
  const iw = W - padL - padR, ih = H - padT - padB;
  const n = series.length;
  const max = Math.max(1, ...series.map((d) => d.value));
  const x = (i) => padL + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v) => padT + ih - (v / max) * ih;

  // yatay ızgara
  for (let g = 0; g <= 2; g++) {
    const yy = padT + (ih / 2) * g;
    s.appendChild(svgEl('line', { x1: padL, y1: yy, x2: W - padR, y2: yy, class: 'chart-grid' }));
  }

  if (n > 0) {
    let line = '';
    series.forEach((d, i) => { line += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(d.value).toFixed(1) + ' '; });

    if (area) {
      const gid = nid();
      const defs = svgEl('defs');
      const grad = svgEl('linearGradient', { id: gid, x1: '0', y1: '0', x2: '0', y2: '1' });
      const st1 = svgEl('stop', { offset: '0' }); st1.style.stopColor = color; st1.style.stopOpacity = '0.35';
      const st2 = svgEl('stop', { offset: '1' }); st2.style.stopColor = color; st2.style.stopOpacity = '0';
      grad.append(st1, st2); defs.appendChild(grad); s.appendChild(defs);
      const areaPath = line + `L${x(n - 1).toFixed(1)} ${padT + ih} L${x(0).toFixed(1)} ${padT + ih} Z`;
      s.appendChild(svgEl('path', { d: areaPath, fill: `url(#${gid})` }));
    }
    const path = svgEl('path', { d: line, fill: 'none', 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    path.style.stroke = color;
    s.appendChild(path);

    // son noktayı vurgula
    const last = svgEl('circle', { cx: x(n - 1), cy: y(series[n - 1].value), r: 3.5 });
    last.style.fill = color;
    s.appendChild(last);
  }

  // x etiketleri (baş / orta / son)
  const idxs = n <= 1 ? [0] : [0, Math.floor((n - 1) / 2), n - 1];
  for (const i of idxs) {
    if (!series[i]) continue;
    const t = svgEl('text', { x: x(i), y: H - 5, 'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle', class: 'chart-label' });
    t.textContent = dayShort(series[i].day);
    s.appendChild(t);
  }
  return s;
}

// axes: [{label, color, value}] value 0..1
export function radarChart(axes, { size = 240 } = {}) {
  const s = svgRoot(size, size);
  const cx = size / 2, cy = size / 2, r = size / 2 - 34;
  const n = axes.length;
  const angle = (i) => (-Math.PI / 2) + (i / n) * Math.PI * 2;
  const pt = (i, rad) => [cx + Math.cos(angle(i)) * rad, cy + Math.sin(angle(i)) * rad];

  // ızgara halkaları
  for (let ring = 1; ring <= 3; ring++) {
    const rr = (r / 3) * ring;
    let d = '';
    for (let i = 0; i < n; i++) { const [px, py] = pt(i, rr); d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1) + ' '; }
    d += 'Z';
    s.appendChild(svgEl('path', { d, fill: 'none', class: 'chart-grid' }));
  }
  // eksen çizgileri + etiketler
  for (let i = 0; i < n; i++) {
    const [px, py] = pt(i, r);
    s.appendChild(svgEl('line', { x1: cx, y1: cy, x2: px, y2: py, class: 'chart-grid' }));
    const [lx, ly] = pt(i, r + 16);
    const t = svgEl('text', { x: lx, y: ly + 4, 'text-anchor': 'middle', class: 'chart-label' });
    t.textContent = axes[i].label;
    s.appendChild(t);
  }
  // veri poligonu
  const gid = nid();
  const defs = svgEl('defs');
  const grad = svgEl('radialGradient', { id: gid });
  const st1 = svgEl('stop', { offset: '0' }); st1.style.stopColor = 'var(--accent)'; st1.style.stopOpacity = '0.5';
  const st2 = svgEl('stop', { offset: '1' }); st2.style.stopColor = 'var(--accent-2)'; st2.style.stopOpacity = '0.25';
  grad.append(st1, st2); defs.appendChild(grad); s.appendChild(defs);

  let d = '';
  for (let i = 0; i < n; i++) {
    const v = Math.max(0.04, Math.min(1, axes[i].value));
    const [px, py] = pt(i, r * v);
    d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1) + ' ';
  }
  d += 'Z';
  const poly = svgEl('path', { d, fill: `url(#${gid})`, 'stroke-width': 2 });
  poly.style.stroke = 'var(--accent)';
  s.appendChild(poly);
  // köşe noktaları
  for (let i = 0; i < n; i++) {
    const v = Math.max(0.04, Math.min(1, axes[i].value));
    const [px, py] = pt(i, r * v);
    const c = svgEl('circle', { cx: px, cy: py, r: 3 });
    c.style.fill = axes[i].color || 'var(--accent)';
    s.appendChild(c);
  }
  return s;
}

// data: [{label, value, color}]
export function barChart(data, { W = 340, H = 160 } = {}) {
  const s = svgRoot(W, H);
  const padT = 10, padB = 22, padL = 6, padR = 6;
  const ih = H - padT - padB, iw = W - padL - padR;
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const bw = (iw / n) * 0.6;
  const gap = (iw / n);
  data.forEach((d, i) => {
    const h = (d.value / max) * ih;
    const bx = padL + gap * i + (gap - bw) / 2;
    const by = padT + ih - h;
    const rect = svgEl('rect', { x: bx, y: by, width: bw, height: Math.max(1, h), rx: 4 });
    rect.style.fill = d.color || 'var(--accent)';
    s.appendChild(rect);
    const t = svgEl('text', { x: bx + bw / 2, y: H - 7, 'text-anchor': 'middle', class: 'chart-label' });
    t.textContent = d.label;
    s.appendChild(t);
  });
  return s;
}

export function chartCard(title, chartNode, subtitle) {
  return el('div', { class: 'card chart-card' },
    el('div', { class: 'card-head' },
      el('h3', {}, title),
      subtitle ? el('span', { class: 'muted small' }, subtitle) : null),
    chartNode,
  );
}

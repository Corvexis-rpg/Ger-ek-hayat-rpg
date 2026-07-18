// Basit hash router + yumuşak sayfa geçiş animasyonu.
import { clear, el } from './ui/components/dom.js';

const routes = {};
let currentRoute = null;
let outlet, navOutlet;
let onRouteChange = null;

export function registerRoute(name, renderFn) { routes[name] = renderFn; }
export function setOutlets(main, nav) { outlet = main; navOutlet = nav; }
export function setOnRouteChange(fn) { onRouteChange = fn; }

export function currentName() { return currentRoute; }

function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const [name, ...rest] = h.split('/');
  return { name: name || 'home', params: rest };
}

export async function navigate() {
  const { name, params } = parseHash();
  const render = routes[name] || routes['home'];
  const target = routes[name] ? name : 'home';

  // çıkış animasyonu
  if (outlet.firstChild) {
    outlet.firstChild.classList.add('screen-exit');
  }
  const view = el('div', { class: 'screen screen-enter' });
  const content = await render(params, view);
  if (content && content !== view) view.appendChild(content);

  // DOM değişimi
  requestAnimationFrame(() => {
    clear(outlet);
    outlet.appendChild(view);
    requestAnimationFrame(() => view.classList.remove('screen-enter'));
    outlet.scrollTop = 0;
    window.scrollTo(0, 0);
  });

  currentRoute = target;
  if (onRouteChange) onRouteChange(target);
}

export function startRouter() {
  window.addEventListener('hashchange', navigate);
  if (!location.hash) location.hash = '#/home';
  navigate();
}

export function go(route) {
  if (location.hash === '#/' + route) navigate();
  else location.hash = '#/' + route;
}

// Mevcut ekranı animasyonsuz, yerinde yeniden çiz (veri değişimi sonrası).
export async function rerender() {
  if (!currentRoute || !outlet) return;
  const render = routes[currentRoute] || routes['home'];
  const view = el('div', { class: 'screen' });
  const content = await render([], view);
  if (content && content !== view) view.appendChild(content);
  const prevScroll = outlet.scrollTop;
  clear(outlet);
  outlet.appendChild(view);
  outlet.scrollTop = prevScroll;
}

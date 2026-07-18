// Uygulama önyüklemesi: durum, tema, router, olaylar, kutlamalar, PWA.
import * as store from './store.js';
import { subscribe } from './store.js';
import { registerRoute, setOutlets, setOnRouteChange, startRouter, rerender } from './router.js';
import { el, clear } from './ui/components/dom.js';
import { renderNav } from './ui/nav.js';
import { renderHome } from './ui/screens/home.js';
import { renderActions } from './ui/screens/actions.js';
import { renderQuests } from './ui/screens/quests.js';
import { renderStats } from './ui/screens/stats.js';
import { renderAchievements } from './ui/screens/achievements.js';
import { renderCharacter } from './ui/screens/character.js';
import { renderOnboarding } from './ui/screens/onboarding.js';
import { openQuickAdd } from './ui/actionForms.js';
import { burst, sparkle } from './ui/components/confetti.js';
import { showToast, showBanner } from './ui/components/toast.js';
import { accentById } from './config/rewards.js';
import { statById } from './config/stats.js';
import { titleForLevel } from './config/titles.js';
import { ACHIEVEMENT_MAP } from './config/achievements.js';
import { rewardById } from './config/rewards.js';
import { autoLocalBackup } from './services/backup.js';
import { maybeSendSystemReminder } from './services/reminders.js';

const app = document.getElementById('app');
let fab, navOutlet, outlet, initialized = false;

function applyTheme() {
  const s = store.settings();
  document.documentElement.dataset.theme = s.theme || 'dark';
  const acc = accentById(s.accent);
  document.documentElement.style.setProperty('--accent', acc.color);
  document.documentElement.style.setProperty('--accent-2', acc.color2);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', s.theme === 'light' ? '#f4f5fb' : '#0f0b24');
}

function buildShell() {
  clear(app);
  outlet = el('main', { class: 'outlet', id: 'outlet' });
  navOutlet = el('div', { id: 'nav-outlet' });
  fab = el('button', { class: 'fab', 'aria-label': 'Eylem ekle', onclick: openQuickAdd }, '＋');
  app.append(outlet, fab, navOutlet);
  setOutlets(outlet, navOutlet);
}

function initApp() {
  if (initialized) return;
  initialized = true;
  buildShell();

  registerRoute('home', renderHome);
  registerRoute('actions', renderActions);
  registerRoute('quests', renderQuests);
  registerRoute('stats', renderStats);
  registerRoute('achievements', renderAchievements);
  registerRoute('character', renderCharacter);

  setOnRouteChange((route) => {
    clear(navOutlet);
    navOutlet.appendChild(renderNav(route));
    // karakter ekranında FAB gizli
    fab.style.display = route === 'character' ? 'none' : '';
  });

  startRouter();
  wireEvents();

  // günlük bakım + yedek + hatırlatma
  autoBackupAndRemind();
}

let rerenderQueued = false;
function wireEvents() {
  subscribe((type, payload) => {
    switch (type) {
      case 'change':
        if (!rerenderQueued) {
          rerenderQueued = true;
          requestAnimationFrame(() => { rerenderQueued = false; rerender(); });
        }
        break;
      case 'settings':
        applyTheme();
        break;
      case 'actionLogged': {
        showToast(`+${payload.totalXp} XP${payload.mult > 1 ? '  ×' + payload.mult + ' 🔥' : ''}`, 'success', 1600);
        const r = fab ? fab.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
        sparkle(r.left + r.width / 2, r.top + r.height / 2);
        break;
      }
      case 'levelup':
        celebrateLevelUp(payload);
        break;
      case 'achievement': {
        const a = ACHIEVEMENT_MAP[payload.id];
        if (a) { burst({ count: 70, origin: { x: 0.5, y: 0.35 } }); showBanner({ icon: a.icon, title: 'Başarım Açıldı!', subtitle: a.name, tone: 'gold' }); }
        break;
      }
      case 'questComplete': {
        const q = payload.quest;
        burst({ count: 60, origin: { x: 0.5, y: 0.4 } });
        showBanner({ icon: q.icon || '✅', title: 'Görev Tamamlandı!', subtitle: q.title, tone: 'accent' });
        break;
      }
      case 'reward': {
        const r = rewardById(payload.id);
        if (r) showBanner({ icon: '🎁', title: 'Yeni Ödül!', subtitle: r.name, tone: 'accent' });
        break;
      }
      case 'toast':
        showToast(payload.message, payload.tone || 'info');
        break;
    }
  });
}

function celebrateLevelUp(payload) {
  burst({ count: 130, origin: { x: 0.5, y: 0.4 }, spread: 1.2 });
  if (payload.character) {
    const t = titleForLevel(payload.to);
    showBanner({ icon: '🎉', title: `Seviye ${payload.to}!`, subtitle: `Unvan: ${t.name}`, tone: 'accent' });
  } else {
    const s = statById(payload.statId);
    if (s) showBanner({ icon: s.icon, title: `${s.name} Sv ${payload.to}!`, subtitle: 'Gelişmeye devam 💪', tone: 'accent' });
  }
}

async function autoBackupAndRemind() {
  const s = store.settings();
  if (s.autoBackup) { autoLocalBackup(); }
  // hatırlatmaları (izin varsa) nazikçe gönder
  setTimeout(() => maybeSendSystemReminder(), 3000);
}

// gün değişimi / geri dönüş: bakım tekrar çalışsın
let lastMaintDay = null;
async function checkDayRollover() {
  const today = new Date().toDateString();
  if (lastMaintDay && lastMaintDay !== today) {
    await store.runMaintenance();
  }
  lastMaintDay = today;
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDayRollover(); });

async function boot() {
  await store.load();
  applyTheme();
  lastMaintDay = new Date().toDateString();

  if (!store.state.character || !store.state.meta.onboarded) {
    clear(app);
    const onb = renderOnboarding(() => { initApp(); location.hash = '#/home'; });
    app.appendChild(onb);
  } else {
    await store.runMaintenance();
    initApp();
  }

  registerServiceWorker();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
}

boot().catch((err) => {
  console.error(err);
  app.innerHTML = '<div style="padding:24px;color:#fff">Bir hata oluştu. Sayfayı yenile.</div>';
});

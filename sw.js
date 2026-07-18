// Service worker — app shell önbelleği + çevrimdışı çalışma.
const CACHE = 'ghrpg-v3';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  './src/main.js',
  './src/router.js',
  './src/store.js',
  './src/db.js',
  './src/config/stats.js',
  './src/config/quickActions.js',
  './src/config/titles.js',
  './src/config/rewards.js',
  './src/config/achievements.js',
  './src/config/quests.js',
  './src/config/quotes.js',
  './src/domain/xp.js',
  './src/domain/streaks.js',
  './src/domain/rust.js',
  './src/domain/character.js',
  './src/domain/quests.js',
  './src/domain/achievements.js',
  './src/domain/stats.js',
  './src/services/time.js',
  './src/services/backup.js',
  './src/services/notifications.js',
  './src/services/reminders.js',
  './src/ui/nav.js',
  './src/ui/actionForms.js',
  './src/ui/routine.js',
  './src/ui/components/dom.js',
  './src/ui/components/confetti.js',
  './src/ui/components/toast.js',
  './src/ui/components/sheet.js',
  './src/ui/components/progressBar.js',
  './src/ui/components/virtualList.js',
  './src/ui/components/charts.js',
  './src/ui/screens/home.js',
  './src/ui/screens/actions.js',
  './src/ui/screens/quests.js',
  './src/ui/screens/stats.js',
  './src/ui/screens/achievements.js',
  './src/ui/screens/character.js',
  './src/ui/screens/onboarding.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => {}) // tek bir varlık eksikse kurulumu engelleme
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // gezinme istekleri → app shell
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // diğerleri → cache-first, sonra ağ (ve runtime cache)
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

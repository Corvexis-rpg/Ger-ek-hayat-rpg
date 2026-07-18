// Yerel bildirim sarmalayıcı. İzin yoksa sessizce uygulama içi geri bildirime düşer.

export function supported() {
  return typeof Notification !== 'undefined';
}

export function permission() {
  return supported() ? Notification.permission : 'denied';
}

export async function requestPermission() {
  if (!supported()) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  try { return await Notification.requestPermission(); }
  catch { return Notification.permission; }
}

export function notify(title, body) {
  if (!supported() || Notification.permission !== 'granted') return false;
  try {
    new Notification(title, {
      body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      tag: 'ghrpg-reminder',
    });
    return true;
  } catch { return false; }
}

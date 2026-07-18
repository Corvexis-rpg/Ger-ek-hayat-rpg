// IndexedDB ince sarmalayıcı. Store'lar ve göç (migration) burada.
const DB_NAME = 'gercek-hayat-rpg';
const DB_VERSION = 1;

// kv: tekil dokümanlar (meta, character, statProgress, streaks, achievements, rewards)
// actions: eylem günlüğü (indeksli), actionTypes: eylem tanımları, quests: görevler
export const STORES = {
  kv: 'kv',
  actions: 'actions',
  actionTypes: 'actionTypes',
  quests: 'quests',
};

let _db = null;

export function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORES.kv)) {
        db.createObjectStore(STORES.kv, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.actions)) {
        const s = db.createObjectStore(STORES.actions, { keyPath: 'id' });
        s.createIndex('by-day', 'day');
        s.createIndex('by-timestamp', 'timestamp');
        s.createIndex('by-type', 'actionTypeId');
      }
      if (!db.objectStoreNames.contains(STORES.actionTypes)) {
        db.createObjectStore(STORES.actionTypes, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.quests)) {
        db.createObjectStore(STORES.quests, { keyPath: 'id' });
      }
      // Gelecekteki sürümler için: e.oldVersion kontrolüyle yeni store/indeks ekle.
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

function tx(storeName, mode) {
  return openDB().then((db) => {
    const t = db.transaction(storeName, mode);
    return { store: t.objectStore(storeName), done: txDone(t) };
  });
}

function txDone(t) {
  return new Promise((resolve, reject) => {
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

function reqP(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAll(storeName) {
  const { store, done } = await tx(storeName, 'readonly');
  const res = await reqP(store.getAll());
  await done;
  return res;
}

export async function get(storeName, key) {
  const { store, done } = await tx(storeName, 'readonly');
  const res = await reqP(store.get(key));
  await done;
  return res;
}

export async function put(storeName, value) {
  const { store, done } = await tx(storeName, 'readwrite');
  store.put(value);
  await done;
  return value;
}

export async function putMany(storeName, values) {
  if (!values.length) return;
  const { store, done } = await tx(storeName, 'readwrite');
  for (const v of values) store.put(v);
  await done;
}

export async function del(storeName, key) {
  const { store, done } = await tx(storeName, 'readwrite');
  store.delete(key);
  await done;
}

export async function clearStore(storeName) {
  const { store, done } = await tx(storeName, 'readwrite');
  store.clear();
  await done;
}

// kv yardımcıları
export function kvGet(key) { return get(STORES.kv, key).then((r) => (r ? r.value : undefined)); }
export function kvSet(key, value) { return put(STORES.kv, { key, value }); }

export async function clearAll() {
  await Promise.all([
    clearStore(STORES.kv),
    clearStore(STORES.actions),
    clearStore(STORES.actionTypes),
    clearStore(STORES.quests),
  ]);
}

export async function exportAll() {
  const [kv, actions, actionTypes, quests] = await Promise.all([
    getAll(STORES.kv), getAll(STORES.actions), getAll(STORES.actionTypes), getAll(STORES.quests),
  ]);
  return { kv, actions, actionTypes, quests };
}

export async function importAll(data) {
  await clearAll();
  await Promise.all([
    putMany(STORES.kv, data.kv || []),
    putMany(STORES.actions, data.actions || []),
    putMany(STORES.actionTypes, data.actionTypes || []),
    putMany(STORES.quests, data.quests || []),
  ]);
}

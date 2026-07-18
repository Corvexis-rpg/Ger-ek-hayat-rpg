// Merkezi durum + kalıcılık + olay yayını (pub/sub). Tek gerçek kaynak.
import * as db from './db.js';
import { STORES } from './db.js';
import { STATS, MAIN_STATS } from './config/stats.js';
import { DEFAULT_ACTION_TYPES } from './config/quickActions.js';
import { ALL_REWARDS } from './config/rewards.js';
import { ACHIEVEMENT_MAP } from './config/achievements.js';
import { statLevelInfo } from './domain/xp.js';
import { applyStreak, OVERALL_KEY } from './domain/streaks.js';
import { rustAmount } from './domain/rust.js';
import { characterInfo } from './domain/character.js';
import { newlyUnlocked } from './domain/achievements.js';
import { selectDaily, selectWeekly, selectSide, evaluate, filterPeriodActions } from './domain/quests.js';
import { todayKey, dayKey, weekKey, dateFromKey } from './services/time.js';

function uid() {
  return (crypto.randomUUID && crypto.randomUUID()) ||
    (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
}

// ---- durum ----
export const state = {
  meta: null,
  character: null,
  statProgress: {},   // statId -> {xp, level, lastActivityDay, lastRustDay}
  streaks: {},        // key -> {current, longest, lastDay, multiplier}
  achievements: {},   // id -> {unlockedAt}
  rewards: {},        // id -> {unlockedAt, equipped}
  actionTypes: [],
  actions: [],        // timestamp'e göre azalan sıralı
  quests: [],         // instance | template | goal
  ready: false,
};

// ---- pub/sub ----
const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit(type, payload) { for (const fn of listeners) fn(type, payload); }
function change() { emit('change'); }

// ---- yardımcılar ----
export function typeMap() {
  return Object.fromEntries(state.actionTypes.map((t) => [t.id, t]));
}
export function settings() { return state.meta.settings; }

function defaultMeta() {
  return {
    key: 'meta',
    schemaVersion: 1,
    createdAt: Date.now(),
    lastActiveDay: null,
    onboarded: false,
    settings: { theme: 'dark', accent: 'violet', reminders: true, autoBackup: true, lastBackup: null },
  };
}

// ---- yükleme / ilk kurulum ----
export async function load() {
  await db.openDB();
  let meta = await db.kvGet('meta');
  if (!meta) { meta = defaultMeta(); await db.kvSet('meta', meta); }
  state.meta = meta;

  state.character = (await db.kvGet('character')) || null;
  state.statProgress = (await db.kvGet('statProgress')) || {};
  state.streaks = (await db.kvGet('streaks')) || {};
  state.achievements = (await db.kvGet('achievements')) || {};
  state.rewards = (await db.kvGet('rewards')) || {};

  // stat kayıtlarını garanti et
  for (const s of STATS) {
    if (!state.statProgress[s.id]) {
      state.statProgress[s.id] = { xp: 0, level: 1, lastActivityDay: null, lastRustDay: null };
    }
  }

  state.actionTypes = await db.getAll(STORES.actionTypes);
  if (!state.actionTypes.length) {
    state.actionTypes = DEFAULT_ACTION_TYPES.map((t, i) => ({
      ...t, uses: 0, sortOrder: i, isCustom: false, isFavorite: !!t.isFavorite,
    }));
    await db.putMany(STORES.actionTypes, state.actionTypes);
  }

  state.actions = (await db.getAll(STORES.actions)).sort((a, b) => b.timestamp - a.timestamp);
  state.quests = await db.getAll(STORES.quests);

  // varsayılan ödülleri aç
  syncRewards(true);
  await persistRewards();

  state.ready = true;
}

// ---- kalıcılık ----
function persistStatProgress() { return db.kvSet('statProgress', state.statProgress); }
function persistStreaks() { return db.kvSet('streaks', state.streaks); }
function persistAchievements() { return db.kvSet('achievements', state.achievements); }
function persistRewards() { return db.kvSet('rewards', state.rewards); }
function persistMeta() { return db.kvSet('meta', state.meta); }
function persistCharacter() { return db.kvSet('character', state.character); }
function persistQuest(q) { return db.put(STORES.quests, q); }
function persistType(t) { return db.put(STORES.actionTypes, t); }

// ---- XP uygulama ----
function applyXpToStat(statId, xp, day, levelUps) {
  const prog = state.statProgress[statId] || { xp: 0, level: 1, lastActivityDay: null, lastRustDay: null };
  const before = statLevelInfo(prog.xp).level;
  prog.xp = Math.max(0, prog.xp + xp);
  if (xp > 0) prog.lastActivityDay = day; // paslanmayı durdur
  const after = statLevelInfo(prog.xp).level;
  prog.level = after;
  state.statProgress[statId] = prog;
  if (after > before && levelUps) levelUps.push({ statId, from: before, to: after });
}

function mergeAwards(awards) {
  const map = new Map();
  for (const a of awards) map.set(a.statId, (map.get(a.statId) || 0) + a.xp);
  return [...map.entries()].map(([statId, xp]) => ({ statId, xp }));
}

// ---- ödül senkronizasyonu ----
function syncRewards(silent = false) {
  const charLevel = state.character ? characterInfo(state.statProgress).level : 1;
  const newOnes = [];
  for (const r of ALL_REWARDS) {
    if (state.rewards[r.id]) continue;
    const u = r.unlock;
    let ok = false;
    if (u.type === 'default') ok = true;
    else if (u.type === 'level') ok = charLevel >= u.level;
    else if (u.type === 'achievement') ok = !!state.achievements[u.id];
    if (ok) {
      state.rewards[r.id] = { unlockedAt: Date.now(), equipped: u.type === 'default' && isDefaultEquip(r) };
      if (u.type !== 'default') newOnes.push(r.id);
    }
  }
  if (!silent) for (const id of newOnes) emit('reward', { id });
  return newOnes;
}

function isDefaultEquip(r) {
  // menekşe accent ve büyücü avatar başlangıçta seçili değil; karakter oluşturmada belirlenir
  return false;
}

// ---- ana eylem kaydı ----
export async function logAction(actionTypeId, opts = {}) {
  const type = typeMap()[actionTypeId];
  if (!type) return { ok: false };
  const now = opts.at || Date.now();
  const day = dayKey(new Date(now));

  if (type.dailyLimit) {
    const countToday = state.actions.filter((a) => a.actionTypeId === actionTypeId && a.day === day).length;
    if (countToday >= type.dailyLimit) {
      emit('toast', { message: `Bugünlük "${type.name}" limitine ulaştın 🎯`, tone: 'info' });
      return { ok: false, limited: true };
    }
  }

  const charBefore = characterInfo(state.statProgress).level;
  const levelUps = [];

  // seri güncelle (bu tür)
  const sres = applyStreak(state.streaks[actionTypeId], day);
  state.streaks[actionTypeId] = sres.streak;
  const mult = sres.streak.multiplier;

  // genel aktiflik serisi
  const overall = applyStreak(state.streaks[OVERALL_KEY], day);
  state.streaks[OVERALL_KEY] = overall.streak;

  // XP hesapla (çarpanlı)
  let awards = type.awards.map((a) => ({ statId: a.statId, xp: Math.max(1, Math.round(a.xp * mult)) }));
  // seri devam ettiyse küçük disiplin bonusu
  if (sres.continued) awards.push({ statId: 'disiplin', xp: 3 });
  awards = mergeAwards(awards);

  for (const a of awards) applyXpToStat(a.statId, a.xp, day, levelUps);

  const action = {
    id: uid(), actionTypeId, timestamp: now, day,
    note: (opts.note || '').trim() || null,
    statAwards: awards, multiplierApplied: mult,
  };
  state.actions.unshift(action);
  await db.put(STORES.actions, action);

  // kullanım sayacı (favori/sıralama için)
  type.uses = (type.uses || 0) + 1;
  await persistType(type);

  await Promise.all([persistStatProgress(), persistStreaks()]);

  // karakter seviye atlaması
  const charAfter = characterInfo(state.statProgress).level;
  if (charAfter > charBefore) levelUps.push({ statId: null, from: charBefore, to: charAfter, character: true });

  // görevleri ve başarımları çöz
  const completedQuests = await settleQuests(day, now);
  const unlocked = await settleAchievements();
  const newRewards = syncRewards();
  if (newRewards.length) await persistRewards();

  // olayları yay
  for (const lu of levelUps) emit('levelup', lu);
  for (const q of completedQuests) emit('questComplete', { quest: q });
  for (const id of unlocked) emit('achievement', { id });

  const totalXp = awards.reduce((s, a) => s + a.xp, 0);
  emit('actionLogged', { action, totalXp, mult });
  change();
  return { ok: true, action, levelUps, totalXp, mult };
}

// ---- görev çözümü ----
async function settleQuests(day, now) {
  const tm = typeMap();
  const completed = [];
  for (const q of state.quests) {
    if (q.kind === 'template') continue;
    if (q.status === 'completed') continue;
    const period = q.type === 'weekly' ? 'week' : 'day';
    const periodKey = q.kind === 'goal' ? null : q.periodKey;
    let pool;
    if (q.kind === 'goal') pool = state.actions;
    else pool = filterPeriodActions(state.actions, period, periodKey);
    const ev = evaluate(q, pool, tm);
    if (ev.done) {
      q.status = 'completed';
      q.completedAt = now;
      // ödül XP
      if (q.reward && q.reward.xp) applyXpToStat(q.reward.statId, q.reward.xp, day, null);
      await persistQuest(q);
      completed.push(q);
    }
  }
  if (completed.length) await persistStatProgress();
  return completed;
}

async function settleAchievements() {
  const ids = newlyUnlocked(state, state.achievements);
  for (const id of ids) state.achievements[id] = { unlockedAt: Date.now() };
  if (ids.length) await persistAchievements();
  return ids;
}

// ---- manuel görev tamamlama (yan/manuel kriter) ----
export async function completeManualQuest(questId) {
  const q = state.quests.find((x) => x.id === questId);
  if (!q || q.status === 'completed') return;
  q.manualDone = true;
  await persistQuest(q);
  const day = todayKey();
  const completed = await settleQuests(day, Date.now());
  const unlocked = await settleAchievements();
  const newRewards = syncRewards();
  if (newRewards.length) await persistRewards();
  for (const c of completed) emit('questComplete', { quest: c });
  for (const id of unlocked) emit('achievement', { id });
  change();
}

// ---- günlük bakım (paslanma + görev üretimi) ----
export async function runMaintenance() {
  const today = todayKey();
  const wk = weekKey(new Date());
  let touched = false;

  // paslanma
  for (const s of STATS) {
    const prog = state.statProgress[s.id];
    const amt = rustAmount(prog, today);
    if (amt > 0) {
      prog.xp = Math.max(0, prog.xp - amt);
      prog.level = statLevelInfo(prog.xp).level;
      prog.lastRustDay = today;
      touched = true;
    }
  }
  if (touched) await persistStatProgress();

  // eski dönem görevlerini temizle (goal/template hariç)
  const stale = state.quests.filter((q) =>
    q.kind === 'instance' &&
    ((q.type === 'weekly' && q.periodKey !== wk) ||
     ((q.type === 'daily' || q.type === 'side') && q.periodKey !== today)));
  for (const q of stale) await db.del(STORES.quests, q.id);
  if (stale.length) state.quests = state.quests.filter((q) => !stale.includes(q));

  // günlük görev üretimi
  await ensureDailyQuests(today);
  await ensureWeeklyQuests(wk);
  await ensureSideQuest(today);

  if (state.meta.lastActiveDay !== today) {
    state.meta.lastActiveDay = today;
    await persistMeta();
  }

  // başarımları da bir kez değerlendir
  const unlocked = await settleAchievements();
  const newRewards = syncRewards();
  if (newRewards.length) await persistRewards();
  for (const id of unlocked) emit('achievement', { id });
  change();
}

function hasInstance(type, sourceId, periodKey) {
  return state.quests.some((q) => q.kind === 'instance' && q.type === type &&
    q.sourceId === sourceId && q.periodKey === periodKey);
}

async function createInstance(type, tpl, periodKey) {
  const q = {
    id: `inst:${type}:${tpl.id}:${periodKey}`,
    kind: 'instance', type,
    title: tpl.title, icon: tpl.icon, criteria: tpl.criteria, reward: tpl.reward,
    periodKey, status: 'active', createdAt: Date.now(), sourceId: tpl.id,
    custom: !!tpl.custom,
  };
  state.quests.push(q);
  await persistQuest(q);
}

async function ensureDailyQuests(today) {
  const chosen = selectDaily(today);
  const customDay = state.quests.filter((q) => q.kind === 'template' && q.period === 'day');
  for (const tpl of [...chosen, ...customDay]) {
    if (!hasInstance('daily', tpl.id, today)) await createInstance('daily', tpl, today);
  }
}

async function ensureWeeklyQuests(wk) {
  const chosen = selectWeekly(wk);
  const customWeek = state.quests.filter((q) => q.kind === 'template' && q.period === 'week');
  for (const tpl of [...chosen, ...customWeek]) {
    if (!hasInstance('weekly', tpl.id, wk)) await createInstance('weekly', tpl, wk);
  }
}

async function ensureSideQuest(today) {
  if (state.quests.some((q) => q.kind === 'instance' && q.type === 'side' && q.periodKey === today)) return;
  const sel = selectSide(today);
  if (sel) await createInstance('side', sel, today);
}

// ---- görev görünümleri ----
export function questView(q) {
  const tm = typeMap();
  const period = q.type === 'weekly' ? 'week' : 'day';
  const pool = q.kind === 'goal' ? state.actions : filterPeriodActions(state.actions, period, q.periodKey);
  const ev = evaluate(q, pool, tm);
  return { ...q, ...ev };
}

export function dailyQuests() {
  const today = todayKey();
  return state.quests.filter((q) => q.kind === 'instance' && q.type === 'daily' && q.periodKey === today).map(questView);
}
export function weeklyQuests() {
  const wk = weekKey(new Date());
  return state.quests.filter((q) => q.kind === 'instance' && q.type === 'weekly' && q.periodKey === wk).map(questView);
}
export function sideQuest() {
  const today = todayKey();
  const q = state.quests.find((x) => x.kind === 'instance' && x.type === 'side' && x.periodKey === today);
  return q ? questView(q) : null;
}
export function goals() {
  return state.quests.filter((q) => q.kind === 'goal').map(questView);
}

// ---- hedef (goal) yönetimi ----
export async function createGoal({ title, icon, criteria, reward }) {
  const q = {
    id: 'goal:' + uid(), kind: 'goal', type: 'goal',
    title, icon: icon || '🎯', criteria, reward: reward || { statId: 'disiplin', xp: 100 },
    periodKey: null, status: 'active', createdAt: Date.now(), custom: true,
  };
  state.quests.push(q);
  await persistQuest(q);
  change();
  return q;
}

export async function deleteQuest(id) {
  await db.del(STORES.quests, id);
  state.quests = state.quests.filter((q) => q.id !== id);
  change();
}

// ---- kullanıcı görev şablonu (günlük/haftalık) ----
export async function createTemplate({ title, icon, period, criteria, reward }) {
  const q = {
    id: 'tpl:' + uid(), kind: 'template', period,
    title, icon: icon || '📌', criteria, reward: reward || { statId: 'disiplin', xp: 15 }, custom: true,
  };
  state.quests.push(q);
  await persistQuest(q);
  await runMaintenance();
  return q;
}

// ---- eylem türleri ----
export async function createActionType({ name, icon, category, awards, dailyLimit }) {
  const t = {
    id: 'custom:' + uid(), name, icon: icon || '✨', category: category || 'diger',
    awards, dailyLimit: dailyLimit || null, isFavorite: true, isCustom: true,
    uses: 0, sortOrder: state.actionTypes.length,
  };
  state.actionTypes.push(t);
  await persistType(t);
  const unlocked = await settleAchievements();
  for (const id of unlocked) emit('achievement', { id });
  change();
  return t;
}

export async function updateActionType(id, patch) {
  const t = state.actionTypes.find((x) => x.id === id);
  if (!t) return;
  Object.assign(t, patch);
  await persistType(t);
  change();
}

export async function deleteActionType(id) {
  await db.del(STORES.actionTypes, id);
  state.actionTypes = state.actionTypes.filter((x) => x.id !== id);
  change();
}

export async function toggleFavorite(id) {
  const t = state.actionTypes.find((x) => x.id === id);
  if (!t) return;
  t.isFavorite = !t.isFavorite;
  await persistType(t);
  change();
}

// favori + en çok kullanılan üstte
export function favoriteActionTypes() {
  return state.actionTypes
    .filter((t) => t.isFavorite)
    .sort((a, b) => (b.uses || 0) - (a.uses || 0) || a.sortOrder - b.sortOrder);
}

// ---- karakter / ayarlar ----
export async function createCharacter({ name, avatarId }) {
  state.character = { name: name.trim() || 'Kahraman', avatarId: avatarId || 'mage', createdAt: Date.now(), cosmeticTitleId: null };
  state.meta.onboarded = true;
  await Promise.all([persistCharacter(), persistMeta()]);
  syncRewards();
  await persistRewards();
  change();
}

export async function updateCharacter(patch) {
  Object.assign(state.character, patch);
  await persistCharacter();
  change();
}

export async function setSetting(key, value) {
  state.meta.settings[key] = value;
  await persistMeta();
  emit('settings', { key, value });
  change();
}

export async function equipReward(kind, id) {
  if (!state.rewards[id]) return;
  if (kind === 'avatar') await updateCharacter({ avatarId: id });
  else if (kind === 'accent') await setSetting('accent', id);
  else if (kind === 'title') await updateCharacter({ cosmeticTitleId: id });
}

export function rewardUnlocked(id) { return !!state.rewards[id]; }

// ---- yedekleme ----
export async function importData(data) {
  await db.importAll(data);
  await load();
  await runMaintenance();
  change();
}

export async function resetAll() {
  await db.clearAll();
  // durumu sıfırla
  Object.assign(state, {
    meta: null, character: null, statProgress: {}, streaks: {},
    achievements: {}, rewards: {}, actionTypes: [], actions: [], quests: [], ready: false,
  });
  await load();
  change();
}

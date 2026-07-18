// Kozmetik ödüller: avatarlar, tema vurgu renkleri, kozmetik unvanlar.
// unlock: { type:'level', level } | { type:'achievement', id } | { type:'default' }

export const AVATARS = [
  { id: 'mage',    emoji: '🧙', name: 'Büyücü',    unlock: { type: 'default' } },
  { id: 'elf',     emoji: '🧝', name: 'Elf',        unlock: { type: 'default' } },
  { id: 'knight',  emoji: '🛡️', name: 'Şövalye',   unlock: { type: 'default' } },
  { id: 'fox',     emoji: '🦊', name: 'Tilki',      unlock: { type: 'default' } },
  { id: 'astro',   emoji: '🧑‍🚀', name: 'Kâşif',    unlock: { type: 'default' } },
  { id: 'cat',     emoji: '🐱', name: 'Kedi',       unlock: { type: 'default' } },
  { id: 'dragon',  emoji: '🐉', name: 'Ejderha',    unlock: { type: 'level', level: 5 } },
  { id: 'wolf',    emoji: '🐺', name: 'Kurt',       unlock: { type: 'level', level: 7 } },
  { id: 'ninja',   emoji: '🥷', name: 'Ninja',      unlock: { type: 'level', level: 10 } },
  { id: 'lion',    emoji: '🦁', name: 'Aslan',      unlock: { type: 'level', level: 15 } },
  { id: 'crown',   emoji: '👑', name: 'Hükümdar',   unlock: { type: 'level', level: 20 } },
  { id: 'robot',   emoji: '🤖', name: 'Otomaton',   unlock: { type: 'achievement', id: 'yuz_eylem' } },
  { id: 'vampire', emoji: '🧛', name: 'Gece Lordu', unlock: { type: 'achievement', id: 'seri_30' } },
  { id: 'owl',     emoji: '🦉', name: 'Bilge Baykuş',unlock: { type: 'achievement', id: 'zihin_usta' } },
  { id: 'coder',   emoji: '👨‍💻', name: 'Kod Ustası', unlock: { type: 'achievement', id: 'kod_50' } },
  { id: 'poly',    emoji: '🦜', name: 'Poliglot',   unlock: { type: 'achievement', id: 'dil_50' } },
  { id: 'unicorn', emoji: '🦄', name: 'Efsane',     unlock: { type: 'achievement', id: 'seri_100' } },
  { id: 'alien',   emoji: '👽', name: 'Ziyaretçi',  unlock: { type: 'achievement', id: 'eylem_500' } },
];

// Tema vurgu renkleri (CSS --accent değişkenini değiştirir).
export const ACCENTS = [
  { id: 'violet', name: 'Menekşe', color: '#7c5cff', color2: '#22d3ee', unlock: { type: 'default' } },
  { id: 'ember',  name: 'Kor',     color: '#ff6b6b', color2: '#f59e0b', unlock: { type: 'default' } },
  { id: 'aqua',   name: 'Deniz',   color: '#22d3ee', color2: '#5b8cff', unlock: { type: 'default' } },
  { id: 'forest', name: 'Orman',   color: '#34d399', color2: '#22d3ee', unlock: { type: 'level', level: 3 } },
  { id: 'rose',   name: 'Gül',     color: '#f472b6', color2: '#a78bfa', unlock: { type: 'level', level: 7 } },
  { id: 'sunset', name: 'Gün Batımı', color: '#fb7185', color2: '#fbbf24', unlock: { type: 'level', level: 12 } },
  { id: 'mint',   name: 'Nane',    color: '#2dd4bf', color2: '#a3e635', unlock: { type: 'level', level: 18 } },
  { id: 'gold',   name: 'Altın',   color: '#fbbf24', color2: '#f59e0b', unlock: { type: 'achievement', id: 'seri_30' } },
  { id: 'crimson',name: 'Kızıl',   color: '#f43f5e', color2: '#a855f7', unlock: { type: 'achievement', id: 'yuz_eylem' } },
  { id: 'galaxy', name: 'Galaksi', color: '#818cf8', color2: '#e879f9', unlock: { type: 'achievement', id: 'seviye_25' } },
];

// Kozmetik ekstra unvanlar (seçilebilir "lakap").
export const COSMETIC_TITLES = [
  { id: 'demir_irade', name: 'Demir İradeli',  unlock: { type: 'achievement', id: 'seri_30' } },
  { id: 'gece_kusu',   name: 'Gece Kuşu',      unlock: { type: 'achievement', id: 'yuz_eylem' } },
  { id: 'denge_ustasi',name: 'Denge Ustası',   unlock: { type: 'achievement', id: 'hepsi_10' } },
  { id: 'kod_cini',    name: 'Kod Cini',       unlock: { type: 'achievement', id: 'kod_50' } },
  { id: 'soz_ustasi',  name: 'Söz Ustası',     unlock: { type: 'achievement', id: 'dil_50' } },
  { id: 'maratoncu',   name: 'Maratoncu',      unlock: { type: 'achievement', id: 'seri_100' } },
  { id: 'kasif',       name: 'Yorulmaz Kâşif', unlock: { type: 'achievement', id: 'eylem_500' } },
];

// Karakter kartı çerçeveleri (kozmetik). CSS'te .frame-<id> ile uygulanır.
export const FRAMES = [
  { id: 'none',   name: 'Sade',      unlock: { type: 'default' } },
  { id: 'glow',   name: 'Parıltı',   unlock: { type: 'level', level: 4 } },
  { id: 'ember',  name: 'Kor Hattı', unlock: { type: 'level', level: 8 } },
  { id: 'royal',  name: 'Kraliyet',  unlock: { type: 'level', level: 15 } },
  { id: 'gold',   name: 'Altın Çerçeve', unlock: { type: 'achievement', id: 'seri_30' } },
  { id: 'neon',   name: 'Neon',      unlock: { type: 'achievement', id: 'yuz_eylem' } },
  { id: 'aurora', name: 'Aurora',    unlock: { type: 'achievement', id: 'seviye_25' } },
];

export const ALL_REWARDS = [
  ...AVATARS.map((a) => ({ ...a, kind: 'avatar' })),
  ...ACCENTS.map((a) => ({ ...a, kind: 'accent' })),
  ...COSMETIC_TITLES.map((a) => ({ ...a, kind: 'title' })),
  ...FRAMES.map((a) => ({ ...a, kind: 'frame' })),
];

export function rewardById(id) { return ALL_REWARDS.find((r) => r.id === id); }
export function accentById(id) { return ACCENTS.find((a) => a.id === id) || ACCENTS[0]; }
export function avatarById(id) { return AVATARS.find((a) => a.id === id) || AVATARS[0]; }
export function frameById(id) { return FRAMES.find((a) => a.id === id) || FRAMES[0]; }

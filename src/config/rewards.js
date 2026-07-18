// Kozmetik ödüller: avatarlar, tema vurgu renkleri, kozmetik unvanlar.
// unlock: { type:'level', level } | { type:'achievement', id } | { type:'default' }

export const AVATARS = [
  { id: 'mage',    emoji: '🧙', name: 'Büyücü',    unlock: { type: 'default' } },
  { id: 'elf',     emoji: '🧝', name: 'Elf',        unlock: { type: 'default' } },
  { id: 'knight',  emoji: '🛡️', name: 'Şövalye',   unlock: { type: 'default' } },
  { id: 'fox',     emoji: '🦊', name: 'Tilki',      unlock: { type: 'default' } },
  { id: 'astro',   emoji: '🧑‍🚀', name: 'Kâşif',    unlock: { type: 'default' } },
  { id: 'dragon',  emoji: '🐉', name: 'Ejderha',    unlock: { type: 'level', level: 5 } },
  { id: 'ninja',   emoji: '🥷', name: 'Ninja',      unlock: { type: 'level', level: 10 } },
  { id: 'robot',   emoji: '🤖', name: 'Otomaton',   unlock: { type: 'achievement', id: 'yuz_eylem' } },
  { id: 'vampire', emoji: '🧛', name: 'Gece Lordu', unlock: { type: 'achievement', id: 'seri_30' } },
  { id: 'wizard2', emoji: '🦉', name: 'Bilge Baykuş',unlock: { type: 'achievement', id: 'zihin_usta' } },
];

// Tema vurgu renkleri (CSS --accent değişkenini değiştirir).
export const ACCENTS = [
  { id: 'violet', name: 'Menekşe', color: '#7c5cff', color2: '#22d3ee', unlock: { type: 'default' } },
  { id: 'ember',  name: 'Kor',     color: '#ff6b6b', color2: '#f59e0b', unlock: { type: 'default' } },
  { id: 'forest', name: 'Orman',   color: '#34d399', color2: '#22d3ee', unlock: { type: 'level', level: 3 } },
  { id: 'rose',   name: 'Gül',     color: '#f472b6', color2: '#a78bfa', unlock: { type: 'level', level: 7 } },
  { id: 'gold',   name: 'Altın',   color: '#fbbf24', color2: '#f59e0b', unlock: { type: 'achievement', id: 'seri_30' } },
  { id: 'aqua',   name: 'Deniz',   color: '#22d3ee', color2: '#5b8cff', unlock: { type: 'achievement', id: 'ilk_seviye' } },
];

// Kozmetik ekstra unvanlar (seçilebilir "lakap").
export const COSMETIC_TITLES = [
  { id: 'demir_irade', name: 'Demir İradeli', unlock: { type: 'achievement', id: 'seri_30' } },
  { id: 'gece_kusu',   name: 'Gece Kuşu',     unlock: { type: 'achievement', id: 'yuz_eylem' } },
  { id: 'denge_ustasi',name: 'Denge Ustası',  unlock: { type: 'achievement', id: 'hepsi_10' } },
];

export const ALL_REWARDS = [
  ...AVATARS.map((a) => ({ ...a, kind: 'avatar' })),
  ...ACCENTS.map((a) => ({ ...a, kind: 'accent' })),
  ...COSMETIC_TITLES.map((a) => ({ ...a, kind: 'title' })),
];

export function rewardById(id) { return ALL_REWARDS.find((r) => r.id === id); }
export function accentById(id) { return ACCENTS.find((a) => a.id === id) || ACCENTS[0]; }
export function avatarById(id) { return AVATARS.find((a) => a.id === id) || AVATARS[0]; }

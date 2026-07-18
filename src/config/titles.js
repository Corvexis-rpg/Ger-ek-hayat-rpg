// Karakter seviyesine göre açılan unvanlar (tutarlı RPG isimlendirmesi).
export const TITLES = [
  { level: 1,  id: 'cirak',      name: 'Çırak' },
  { level: 3,  id: 'maceraci',   name: 'Maceracı' },
  { level: 5,  id: 'gezgin',     name: 'Gezgin' },
  { level: 8,  id: 'sovalye',    name: 'Şövalye' },
  { level: 12, id: 'kahraman',   name: 'Kahraman' },
  { level: 17, id: 'usta',       name: 'Usta' },
  { level: 23, id: 'sampiyon',   name: 'Şampiyon' },
  { level: 30, id: 'efsane',     name: 'Efsane' },
  { level: 40, id: 'yaridyanri', name: 'Yarı Tanrı' },
  { level: 50, id: 'olumsuz',    name: 'Ölümsüz' },
];

export function titleForLevel(level) {
  let t = TITLES[0];
  for (const item of TITLES) if (level >= item.level) t = item;
  return t;
}

export function unlockedTitles(level) {
  return TITLES.filter((t) => level >= t.level);
}

export function nextTitle(level) {
  return TITLES.find((t) => t.level > level) || null;
}

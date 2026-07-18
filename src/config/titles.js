// Karakter seviyesine göre açılan unvanlar (tutarlı RPG isimlendirmesi).
export const TITLES = [
  { level: 1,  id: 'cirak',       name: 'Çırak' },
  { level: 2,  id: 'yolcu',       name: 'Acemi Yolcu' },
  { level: 3,  id: 'maceraci',    name: 'Maceracı' },
  { level: 5,  id: 'gezgin',      name: 'Gezgin' },
  { level: 7,  id: 'nisanci',     name: 'Nişancı' },
  { level: 8,  id: 'sovalye',     name: 'Şövalye' },
  { level: 10, id: 'muhafiz',     name: 'Muhafız' },
  { level: 12, id: 'kahraman',    name: 'Kahraman' },
  { level: 15, id: 'savas_ustasi',name: 'Savaş Ustası' },
  { level: 17, id: 'usta',        name: 'Usta' },
  { level: 20, id: 'efsane_sovalye', name: 'Efsanevi Şövalye' },
  { level: 23, id: 'sampiyon',    name: 'Şampiyon' },
  { level: 27, id: 'ejder_avci',  name: 'Ejderha Avcısı' },
  { level: 30, id: 'efsane',      name: 'Efsane' },
  { level: 35, id: 'kahraman_kral', name: 'Kahraman Kral' },
  { level: 40, id: 'yaridyanri',  name: 'Yarı Tanrı' },
  { level: 45, id: 'kadim_bilge', name: 'Kadim Bilge' },
  { level: 50, id: 'olumsuz',     name: 'Ölümsüz' },
  { level: 60, id: 'efsaneler',   name: 'Efsaneler Efsanesi' },
  { level: 75, id: 'zaman_lordu', name: 'Zaman Lordu' },
  { level: 100, id: 'tanrisal',   name: 'Tanrısal Varlık' },
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

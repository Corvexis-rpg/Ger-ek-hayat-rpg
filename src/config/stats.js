// Stat tanımları — yeni stat eklemek için bu listeye giriş eklemek yeterli.
// type: 'main' (ana, sınıf belirler) | 'secondary' (ikincil).

export const STATS = [
  { id: 'beden',      name: 'Beden',      type: 'main',      icon: '💪', color: '#ff6b6b', desc: 'Spor, hareket ve fiziksel aktivite' },
  { id: 'zihin',      name: 'Zihin',      type: 'main',      icon: '🧠', color: '#5b8cff', desc: 'Ders, okuma ve öğrenme' },
  { id: 'saglik',     name: 'Sağlık',     type: 'main',      icon: '❤️', color: '#34d399', desc: 'Beslenme, uyku ve su' },
  { id: 'duzen',      name: 'Düzen',      type: 'main',      icon: '🗂️', color: '#f59e0b', desc: 'İş, görev, temizlik ve planlama' },
  { id: 'disiplin',   name: 'Disiplin',   type: 'secondary', icon: '🛡️', color: '#a78bfa', desc: 'Serileri koruma davranışından beslenir' },
  { id: 'sosyallik',  name: 'Sosyallik',  type: 'secondary', icon: '🤝', color: '#22d3ee', desc: 'Sosyal etkileşim eylemlerinden' },
  { id: 'yaraticilik',name: 'Yaratıcılık',type: 'secondary', icon: '🎨', color: '#f472b6', desc: 'Hobi, sanat ve yazma eylemlerinden' },
  { id: 'merak',      name: 'Merak',      type: 'secondary', icon: '🔭', color: '#38bdf8', desc: 'Öğrenme, dil ve keşiften beslenir' },
  { id: 'huzur',      name: 'Huzur',      type: 'secondary', icon: '🕊️', color: '#5eead4', desc: 'Meditasyon, doğa ve dinginlikten beslenir' },
];

export const STAT_MAP = Object.fromEntries(STATS.map((s) => [s.id, s]));
export const MAIN_STATS = STATS.filter((s) => s.type === 'main');
export const SECONDARY_STATS = STATS.filter((s) => s.type === 'secondary');

export function statById(id) { return STAT_MAP[id]; }

// Ana stat'a göre karakter sınıfı (kozmetik).
export const CLASSES = {
  beden: { id: 'savasci',    name: 'Savaşçı',    icon: '⚔️', desc: 'Bedenini demir gibi işleyen' },
  zihin: { id: 'bilge',      name: 'Bilge',      icon: '📖', desc: 'Bilgiyle güçlenen' },
  saglik:{ id: 'sifaci',     name: 'Şifacı',     icon: '🌿', desc: 'Dengeyi ve sağlığı koruyan' },
  duzen: { id: 'mimar',      name: 'Mimar',      icon: '🏛️', desc: 'Düzeni ve planı ustalıkla kuran' },
};

export const CLASS_BALANCED = { id: 'gezgin', name: 'Dengeli Gezgin', icon: '🧭', desc: 'Her yolu bilen' };

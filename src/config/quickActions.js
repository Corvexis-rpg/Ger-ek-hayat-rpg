// Hazır (varsayılan) eylem türleri. Kullanıcı bunları favoriye alabilir,
// kendi özel eylemlerini ekleyebilir. awards: [{statId, xp}].

export const CATEGORIES = [
  { id: 'hareket',  name: 'Hareket',  icon: '🏃' },
  { id: 'ogrenme',  name: 'Öğrenme',  icon: '📚' },
  { id: 'beslenme', name: 'Beslenme', icon: '🥗' },
  { id: 'uyku',     name: 'Uyku',     icon: '😴' },
  { id: 'zihinsel', name: 'Zihinsel', icon: '🧘' },
  { id: 'gorev',    name: 'Görev',    icon: '✅' },
  { id: 'sosyal',   name: 'Sosyal',   icon: '💬' },
  { id: 'hobi',     name: 'Hobi',     icon: '🎨' },
  { id: 'diger',    name: 'Diğer',    icon: '✨' },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const DEFAULT_ACTION_TYPES = [
  { id: 'spor',           name: 'Spor yaptım',            icon: '🏋️', category: 'hareket',  awards: [{ statId: 'beden', xp: 25 }],                              isFavorite: true },
  { id: 'yuruyus',        name: 'Yürüyüşe çıktım',        icon: '🚶', category: 'hareket',  awards: [{ statId: 'beden', xp: 12 }] },
  { id: 'su',             name: 'Su içtim',               icon: '💧', category: 'beslenme', awards: [{ statId: 'saglik', xp: 5 }],   dailyLimit: 12, isFavorite: true },
  { id: 'saglikli_yemek', name: 'Sağlıklı yemek yedim',   icon: '🥗', category: 'beslenme', awards: [{ statId: 'saglik', xp: 15 }] },
  { id: 'uyku',           name: 'İyi uyudum',             icon: '😴', category: 'uyku',     awards: [{ statId: 'saglik', xp: 20 }], dailyLimit: 1 },
  { id: 'ders',           name: 'Ders çalıştım',          icon: '📚', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 25 }],                             isFavorite: true },
  { id: 'kitap',          name: 'Kitap okudum',           icon: '📖', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 18 }] },
  { id: 'ogren',          name: 'Yeni bir şey öğrendim',  icon: '💡', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 12 }, { statId: 'yaraticilik', xp: 6 }] },
  { id: 'meditasyon',     name: 'Meditasyon yaptım',      icon: '🧘', category: 'zihinsel', awards: [{ statId: 'saglik', xp: 10 }, { statId: 'zihin', xp: 8 }] },
  { id: 'gorev',          name: 'Görev bitirdim',         icon: '✅', category: 'gorev',    awards: [{ statId: 'duzen', xp: 20 }],                             isFavorite: true },
  { id: 'temizlik',       name: 'Temizlik/düzen yaptım',  icon: '🧹', category: 'gorev',    awards: [{ statId: 'duzen', xp: 12 }] },
  { id: 'plan',           name: 'Planlama yaptım',        icon: '🗓️', category: 'gorev',    awards: [{ statId: 'duzen', xp: 10 }] },
  { id: 'sosyal',         name: 'Biriyle vakit geçirdim', icon: '💬', category: 'sosyal',   awards: [{ statId: 'sosyallik', xp: 20 }],                         isFavorite: true },
  { id: 'hobi',           name: 'Hobi/sanatla uğraştım',  icon: '🎨', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 20 }] },
  { id: 'yazma',          name: 'Yazı yazdım',            icon: '✍️', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 15 }, { statId: 'zihin', xp: 5 }] },
];

// Özel eylem oluştururken kullanılabilecek ikonlar.
export const ICON_CHOICES = [
  '🏃','🏋️','🚴','🏊','⚽','🧗','🚶','🤸',
  '📚','📖','✍️','💡','🎓','🧠','🔬','🌐',
  '🥗','💧','🍎','🥦','😴','☕','🍵','💊',
  '🧘','🕯️','🎯','✅','🗓️','🧹','🗂️','💼',
  '💬','🤝','❤️','🎁','📞','👨‍👩‍👧','🎨','🎸',
  '🎮','📷','🎬','🌱','✨','⭐','🔥','⚡',
];

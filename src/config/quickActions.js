// Hazır (varsayılan) eylem türleri. Kullanıcı bunları favoriye alabilir,
// kendi özel eylemlerini ekleyebilir. awards: [{statId, xp}].

export const CATEGORIES = [
  { id: 'hareket',  name: 'Hareket',  icon: '🏃' },
  { id: 'ogrenme',  name: 'Öğrenme',  icon: '📚' },
  { id: 'dil',      name: 'Dil',      icon: '🗣️' },
  { id: 'kod',      name: 'Yazılım',  icon: '💻' },
  { id: 'beslenme', name: 'Beslenme', icon: '🥗' },
  { id: 'uyku',     name: 'Uyku',     icon: '😴' },
  { id: 'oz_bakim', name: 'Öz Bakım', icon: '🧴' },
  { id: 'zihinsel', name: 'Zihinsel', icon: '🧘' },
  { id: 'gorev',    name: 'Görev',    icon: '✅' },
  { id: 'finans',   name: 'Finans',   icon: '💰' },
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

  // --- Dil öğrenme ---
  { id: 'ingilizce',      name: 'İngilizce çalıştım',     icon: '🇬🇧', category: 'dil',      awards: [{ statId: 'zihin', xp: 22 }], isFavorite: true },
  { id: 'kelime',         name: 'Yeni kelime öğrendim',   icon: '🔤', category: 'dil',      awards: [{ statId: 'zihin', xp: 10 }], dailyLimit: 10 },
  { id: 'dil_konus',      name: 'Yabancı dilde konuştum', icon: '🗣️', category: 'dil',      awards: [{ statId: 'zihin', xp: 15 }, { statId: 'sosyallik', xp: 6 }] },
  { id: 'dil_icerik',     name: 'Yabancı dilde içerik izledim', icon: '🎬', category: 'dil', awards: [{ statId: 'zihin', xp: 8 }] },
  { id: 'dil_diger',      name: 'Başka bir dil çalıştım', icon: '🌍', category: 'dil',      awards: [{ statId: 'zihin', xp: 18 }] },

  // --- Yazılım öğrenme ---
  { id: 'kod_yaz',        name: 'Kod yazdım',             icon: '💻', category: 'kod',      awards: [{ statId: 'zihin', xp: 25 }, { statId: 'yaraticilik', xp: 8 }], isFavorite: true },
  { id: 'yazilim_ders',   name: 'Yazılım dersi izledim',  icon: '📼', category: 'kod',      awards: [{ statId: 'zihin', xp: 20 }] },
  { id: 'proje',          name: 'Projede çalıştım',       icon: '🛠️', category: 'kod',      awards: [{ statId: 'zihin', xp: 22 }, { statId: 'yaraticilik', xp: 10 }, { statId: 'duzen', xp: 4 }] },
  { id: 'algoritma',      name: 'Problem/algoritma çözdüm', icon: '🧩', category: 'kod',    awards: [{ statId: 'zihin', xp: 18 }] },
  { id: 'tekno_makale',   name: 'Teknik yazı okudum',     icon: '📄', category: 'kod',      awards: [{ statId: 'zihin', xp: 12 }] },

  // --- Hareket (ek) ---
  { id: 'kosu',           name: 'Koşu yaptım',            icon: '🏃‍♂️', category: 'hareket', awards: [{ statId: 'beden', xp: 22 }] },
  { id: 'bisiklet',       name: 'Bisiklete bindim',       icon: '🚴', category: 'hareket',  awards: [{ statId: 'beden', xp: 20 }] },
  { id: 'esneme',         name: 'Esneme/yoga yaptım',     icon: '🤸', category: 'hareket',  awards: [{ statId: 'beden', xp: 10 }, { statId: 'saglik', xp: 5 }] },
  { id: 'merdiven',       name: 'Merdiven çıktım',        icon: '🪜', category: 'hareket',  awards: [{ statId: 'beden', xp: 6 }], dailyLimit: 6 },
  { id: 'doga',           name: 'Doğada vakit geçirdim',  icon: '🌳', category: 'hareket',  awards: [{ statId: 'saglik', xp: 12 }, { statId: 'yaraticilik', xp: 5 }] },

  // --- Öz bakım ---
  { id: 'erken_kalk',     name: 'Erken kalktım',          icon: '🌅', category: 'oz_bakim', awards: [{ statId: 'duzen', xp: 10 }, { statId: 'disiplin', xp: 5 }], dailyLimit: 1 },
  { id: 'dus',            name: 'Duş aldım',              icon: '🚿', category: 'oz_bakim', awards: [{ statId: 'saglik', xp: 6 }], dailyLimit: 2 },
  { id: 'vitamin',        name: 'Vitamin/takviye aldım',  icon: '💊', category: 'oz_bakim', awards: [{ statId: 'saglik', xp: 5 }], dailyLimit: 2 },
  { id: 'ekran_mola',     name: 'Ekransız mola verdim',   icon: '📵', category: 'oz_bakim', awards: [{ statId: 'saglik', xp: 6 }] },
  { id: 'nefes',          name: 'Nefes egzersizi yaptım', icon: '🌬️', category: 'zihinsel', awards: [{ statId: 'saglik', xp: 8 }] },
  { id: 'sukur',          name: 'Şükür/minnet yazdım',    icon: '🙏', category: 'zihinsel', awards: [{ statId: 'saglik', xp: 8 }, { statId: 'zihin', xp: 4 }], dailyLimit: 1 },

  // --- Görev / üretkenlik (ek) ---
  { id: 'pomodoro',       name: 'Odak seansı (pomodoro)', icon: '⏱️', category: 'gorev',    awards: [{ statId: 'duzen', xp: 10 }, { statId: 'zihin', xp: 8 }] },
  { id: 'gunu_planla',    name: 'Günü planladım',         icon: '🗒️', category: 'gorev',    awards: [{ statId: 'duzen', xp: 12 }, { statId: 'disiplin', xp: 4 }], dailyLimit: 1 },
  { id: 'eposta',         name: 'Gelen kutusunu temizledim', icon: '📧', category: 'gorev', awards: [{ statId: 'duzen', xp: 8 }] },

  // --- Finans ---
  { id: 'butce',          name: 'Bütçe/harcama takibi',   icon: '📊', category: 'finans',   awards: [{ statId: 'duzen', xp: 12 }], dailyLimit: 2 },
  { id: 'birikim',        name: 'Para biriktirdim',       icon: '🐷', category: 'finans',   awards: [{ statId: 'duzen', xp: 15 }, { statId: 'disiplin', xp: 4 }] },
  { id: 'finans_ogren',   name: 'Finans/yatırım öğrendim', icon: '📈', category: 'finans',  awards: [{ statId: 'zihin', xp: 14 }, { statId: 'duzen', xp: 4 }] },

  // --- Hobi / sosyal (ek) ---
  { id: 'gunluk_yaz',     name: 'Günlük tuttum',          icon: '📔', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 12 }, { statId: 'zihin', xp: 5 }] },
  { id: 'muzik',          name: 'Müzik/enstrüman çalıştım', icon: '🎸', category: 'hobi',   awards: [{ statId: 'yaraticilik', xp: 20 }] },
  { id: 'cizim',          name: 'Çizim/resim yaptım',     icon: '✏️', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 20 }] },
  { id: 'fotograf',       name: 'Fotoğraf çektim',        icon: '📷', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 12 }] },
  { id: 'aile',           name: 'Aileyle vakit geçirdim', icon: '👨‍👩‍👧', category: 'sosyal', awards: [{ statId: 'sosyallik', xp: 18 }] },
  { id: 'yardim',         name: 'Birine yardım ettim',    icon: '🤲', category: 'sosyal',   awards: [{ statId: 'sosyallik', xp: 15 }, { statId: 'disiplin', xp: 4 }] },
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

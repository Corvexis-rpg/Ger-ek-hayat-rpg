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
  { id: 'ev',       name: 'Ev & Yaşam', icon: '🏠' },
  { id: 'finans',   name: 'Finans',   icon: '💰' },
  { id: 'sosyal',   name: 'Sosyal',   icon: '💬' },
  { id: 'hobi',     name: 'Hobi',     icon: '🎨' },
  { id: 'diger',    name: 'Diğer',    icon: '✨' },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// Yeni sürümlerde kaldırılan hazır eylemler (mevcut kullanıcılardan da temizlenir).
export const REMOVED_DEFAULT_IDS = ['merdiven', 'eposta', 'sukur'];

export const DEFAULT_ACTION_TYPES = [
  // --- Temel ---
  { id: 'spor',           name: 'Spor yaptım',            icon: '🏋️', category: 'hareket',  awards: [{ statId: 'beden', xp: 25 }], isFavorite: true },
  { id: 'yuruyus',        name: 'Yürüyüşe çıktım',        icon: '🚶', category: 'hareket',  awards: [{ statId: 'beden', xp: 12 }] },
  { id: 'su',             name: 'Su içtim',               icon: '💧', category: 'beslenme', awards: [{ statId: 'saglik', xp: 5 }],   dailyLimit: 12, isFavorite: true },
  { id: 'saglikli_yemek', name: 'Sağlıklı yemek yedim',   icon: '🥗', category: 'beslenme', awards: [{ statId: 'saglik', xp: 15 }] },
  { id: 'uyku',           name: 'İyi uyudum',             icon: '😴', category: 'uyku',     awards: [{ statId: 'saglik', xp: 20 }, { statId: 'huzur', xp: 4 }], dailyLimit: 1 },
  { id: 'ders',           name: 'Ders çalıştım',          icon: '📚', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 25 }, { statId: 'merak', xp: 4 }], isFavorite: true },
  { id: 'kitap',          name: 'Kitap okudum',           icon: '📖', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 18 }, { statId: 'merak', xp: 4 }] },
  { id: 'ogren',          name: 'Yeni bir şey öğrendim',  icon: '💡', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 12 }, { statId: 'yaraticilik', xp: 6 }, { statId: 'merak', xp: 5 }] },
  { id: 'meditasyon',     name: 'Meditasyon yaptım',      icon: '🧘', category: 'zihinsel', awards: [{ statId: 'saglik', xp: 10 }, { statId: 'zihin', xp: 8 }, { statId: 'huzur', xp: 6 }] },
  { id: 'gorev',          name: 'Görev bitirdim',         icon: '✅', category: 'gorev',    awards: [{ statId: 'duzen', xp: 20 }], isFavorite: true },
  { id: 'temizlik',       name: 'Temizlik/düzen yaptım',  icon: '🧹', category: 'gorev',    awards: [{ statId: 'duzen', xp: 12 }] },
  { id: 'plan',           name: 'Planlama yaptım',        icon: '🗓️', category: 'gorev',    awards: [{ statId: 'duzen', xp: 10 }] },
  { id: 'sosyal',         name: 'Biriyle vakit geçirdim', icon: '💬', category: 'sosyal',   awards: [{ statId: 'sosyallik', xp: 20 }], isFavorite: true },
  { id: 'hobi',           name: 'Hobi/sanatla uğraştım',  icon: '🎨', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 20 }] },
  { id: 'yazma',          name: 'Yazı yazdım',            icon: '✍️', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 15 }, { statId: 'zihin', xp: 5 }] },

  // --- Dil öğrenme ---
  { id: 'ingilizce',      name: 'İngilizce çalıştım',     icon: '🇬🇧', category: 'dil',      awards: [{ statId: 'zihin', xp: 22 }, { statId: 'merak', xp: 4 }], isFavorite: true },
  { id: 'ispanyolca',     name: 'İspanyolca çalıştım',    icon: '🇪🇸', category: 'dil',      awards: [{ statId: 'zihin', xp: 22 }, { statId: 'merak', xp: 4 }] },
  { id: 'japonca',        name: 'Japonca çalıştım',       icon: '🇯🇵', category: 'dil',      awards: [{ statId: 'zihin', xp: 22 }, { statId: 'merak', xp: 4 }] },
  { id: 'kelime',         name: 'Yeni kelime öğrendim',   icon: '🔤', category: 'dil',      awards: [{ statId: 'zihin', xp: 10 }, { statId: 'merak', xp: 3 }], dailyLimit: 10 },
  { id: 'dil_konus',      name: 'Yabancı dilde konuştum', icon: '🗣️', category: 'dil',      awards: [{ statId: 'zihin', xp: 15 }, { statId: 'sosyallik', xp: 6 }] },
  { id: 'dil_icerik',     name: 'Yabancı dilde içerik izledim', icon: '🎬', category: 'dil', awards: [{ statId: 'zihin', xp: 8 }, { statId: 'merak', xp: 3 }] },
  { id: 'dil_diger',      name: 'Başka bir dil çalıştım', icon: '🌍', category: 'dil',      awards: [{ statId: 'zihin', xp: 18 }, { statId: 'merak', xp: 3 }] },

  // --- Yazılım öğrenme ---
  { id: 'kod_yaz',        name: 'Kod yazdım',             icon: '💻', category: 'kod',      awards: [{ statId: 'zihin', xp: 25 }, { statId: 'yaraticilik', xp: 8 }, { statId: 'merak', xp: 3 }], isFavorite: true },
  { id: 'yazilim_ders',   name: 'Yazılım dersi izledim',  icon: '📼', category: 'kod',      awards: [{ statId: 'zihin', xp: 20 }, { statId: 'merak', xp: 4 }] },
  { id: 'proje',          name: 'Projede çalıştım',       icon: '🛠️', category: 'kod',      awards: [{ statId: 'zihin', xp: 22 }, { statId: 'yaraticilik', xp: 10 }, { statId: 'duzen', xp: 4 }] },
  { id: 'algoritma',      name: 'Problem/algoritma çözdüm', icon: '🧩', category: 'kod',    awards: [{ statId: 'zihin', xp: 18 }, { statId: 'merak', xp: 4 }] },
  { id: 'tekno_makale',   name: 'Teknik yazı okudum',     icon: '📄', category: 'kod',      awards: [{ statId: 'zihin', xp: 12 }, { statId: 'merak', xp: 3 }] },

  // --- Hareket (ek) ---
  { id: 'kosu',           name: 'Koşu yaptım',            icon: '🏃‍♂️', category: 'hareket', awards: [{ statId: 'beden', xp: 22 }] },
  { id: 'bisiklet',       name: 'Bisiklete bindim',       icon: '🚴', category: 'hareket',  awards: [{ statId: 'beden', xp: 20 }] },
  { id: 'esneme',         name: 'Esneme/yoga yaptım',     icon: '🤸', category: 'hareket',  awards: [{ statId: 'beden', xp: 10 }, { statId: 'saglik', xp: 5 }, { statId: 'huzur', xp: 3 }] },
  { id: 'doga',           name: 'Doğada vakit geçirdim',  icon: '🌳', category: 'hareket',  awards: [{ statId: 'saglik', xp: 12 }, { statId: 'yaraticilik', xp: 5 }, { statId: 'huzur', xp: 4 }] },

  // --- Öz bakım ---
  { id: 'erken_kalk',     name: 'Erken kalktım',          icon: '🌅', category: 'oz_bakim', awards: [{ statId: 'duzen', xp: 10 }, { statId: 'disiplin', xp: 5 }], dailyLimit: 1 },
  { id: 'dus',            name: 'Duş aldım',              icon: '🚿', category: 'oz_bakim', awards: [{ statId: 'saglik', xp: 6 }], dailyLimit: 2 },
  { id: 'vitamin',        name: 'Vitamin/takviye aldım',  icon: '💊', category: 'oz_bakim', awards: [{ statId: 'saglik', xp: 5 }], dailyLimit: 2 },
  { id: 'ekran_mola',     name: 'Ekransız mola verdim',   icon: '📵', category: 'oz_bakim', awards: [{ statId: 'saglik', xp: 6 }, { statId: 'huzur', xp: 4 }] },
  { id: 'nefes',          name: 'Nefes egzersizi yaptım', icon: '🌬️', category: 'zihinsel', awards: [{ statId: 'saglik', xp: 8 }, { statId: 'huzur', xp: 5 }] },

  // --- Görev / üretkenlik (ek) ---
  { id: 'pomodoro',       name: 'Odak seansı (pomodoro)', icon: '⏱️', category: 'gorev',    awards: [{ statId: 'duzen', xp: 10 }, { statId: 'zihin', xp: 8 }] },
  { id: 'gunu_planla',    name: 'Günü planladım',         icon: '🗒️', category: 'gorev',    awards: [{ statId: 'duzen', xp: 12 }, { statId: 'disiplin', xp: 4 }], dailyLimit: 1 },

  // --- Finans ---
  { id: 'butce',          name: 'Bütçe/harcama takibi',   icon: '📊', category: 'finans',   awards: [{ statId: 'duzen', xp: 12 }], dailyLimit: 2 },
  { id: 'birikim',        name: 'Para biriktirdim',       icon: '🐷', category: 'finans',   awards: [{ statId: 'duzen', xp: 15 }, { statId: 'disiplin', xp: 4 }] },
  { id: 'finans_ogren',   name: 'Finans/yatırım öğrendim', icon: '📈', category: 'finans',  awards: [{ statId: 'zihin', xp: 14 }, { statId: 'duzen', xp: 4 }, { statId: 'merak', xp: 3 }] },

  // --- Hobi / sosyal (ek) ---
  { id: 'gunluk_yaz',     name: 'Günlük tuttum',          icon: '📔', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 12 }, { statId: 'zihin', xp: 5 }, { statId: 'huzur', xp: 3 }] },
  { id: 'muzik',          name: 'Müzik/enstrüman çalıştım', icon: '🎸', category: 'hobi',   awards: [{ statId: 'yaraticilik', xp: 20 }] },
  { id: 'cizim',          name: 'Çizim/resim yaptım',     icon: '✏️', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 20 }] },
  { id: 'fotograf',       name: 'Fotoğraf çektim',        icon: '📷', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 12 }] },
  { id: 'aile',           name: 'Aileyle vakit geçirdim', icon: '👨‍👩‍👧', category: 'sosyal', awards: [{ statId: 'sosyallik', xp: 18 }, { statId: 'huzur', xp: 3 }] },
  { id: 'yardim',         name: 'Birine yardım ettim',    icon: '🤲', category: 'sosyal',   awards: [{ statId: 'sosyallik', xp: 15 }, { statId: 'disiplin', xp: 4 }] },

  // ===== Genişletilmiş eylem paketi =====
  // --- Hareket / fitness ---
  { id: 'sinav_log',   name: 'Şınav çektim',            icon: '💪', category: 'hareket',  awards: [{ statId: 'beden', xp: 12 }] },
  { id: 'mekik_log',   name: 'Mekik çektim',            icon: '🔥', category: 'hareket',  awards: [{ statId: 'beden', xp: 12 }] },
  { id: 'plank',       name: 'Plank yaptım',            icon: '🧱', category: 'hareket',  awards: [{ statId: 'beden', xp: 10 }] },
  { id: 'yuzme',       name: 'Yüzdüm',                  icon: '🏊', category: 'hareket',  awards: [{ statId: 'beden', xp: 22 }] },
  { id: 'dans',        name: 'Dans ettim',              icon: '💃', category: 'hareket',  awards: [{ statId: 'beden', xp: 15 }, { statId: 'yaraticilik', xp: 5 }] },
  { id: 'takim_spor',  name: 'Takım sporu oynadım',     icon: '⚽', category: 'hareket',  awards: [{ statId: 'beden', xp: 20 }, { statId: 'sosyallik', xp: 6 }] },
  { id: 'ip_atla',     name: 'İp atladım',              icon: '🪢', category: 'hareket',  awards: [{ statId: 'beden', xp: 12 }] },
  { id: 'hiking',      name: 'Doğa yürüyüşü yaptım',     icon: '🥾', category: 'hareket',  awards: [{ statId: 'beden', xp: 18 }, { statId: 'huzur', xp: 4 }] },
  { id: 'antrenman',   name: 'Antrenman/fitness dersi', icon: '🤾', category: 'hareket',  awards: [{ statId: 'beden', xp: 20 }] },
  { id: 'germe',       name: 'Sabah sporu/germe',       icon: '🌅', category: 'hareket',  awards: [{ statId: 'beden', xp: 8 }, { statId: 'saglik', xp: 4 }] },

  // --- Öğrenme ---
  { id: 'podcast',     name: 'Eğitici podcast dinledim', icon: '🎧', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 10 }, { statId: 'merak', xp: 3 }] },
  { id: 'belgesel',    name: 'Belgesel izledim',        icon: '🎥', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 10 }, { statId: 'merak', xp: 4 }] },
  { id: 'kurs',        name: 'Online kurs ilerlettim',  icon: '🎓', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 20 }, { statId: 'merak', xp: 4 }] },
  { id: 'not_ozet',    name: 'Not/özet çıkardım',       icon: '🗒️', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 10 }, { statId: 'duzen', xp: 3 }] },
  { id: 'tekrar',      name: 'Tekrar/pekiştirme yaptım', icon: '🔁', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 12 }] },
  { id: 'makale_oku',  name: 'Makale okudum',           icon: '📰', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 12 }, { statId: 'merak', xp: 3 }] },
  { id: 'satranc',     name: 'Satranç/zeka oyunu',      icon: '♟️', category: 'ogrenme',  awards: [{ statId: 'zihin', xp: 10 }, { statId: 'merak', xp: 4 }] },

  // --- Dil (ek) ---
  { id: 'almanca',     name: 'Almanca çalıştım',        icon: '🇩🇪', category: 'dil',      awards: [{ statId: 'zihin', xp: 22 }, { statId: 'merak', xp: 4 }] },
  { id: 'fransizca',   name: 'Fransızca çalıştım',      icon: '🇫🇷', category: 'dil',      awards: [{ statId: 'zihin', xp: 22 }, { statId: 'merak', xp: 4 }] },
  { id: 'dil_dinle',   name: 'Dil dinleme pratiği',     icon: '👂', category: 'dil',      awards: [{ statId: 'zihin', xp: 10 }, { statId: 'merak', xp: 3 }] },
  { id: 'dil_yaz',     name: 'Yabancı dilde yazdım',    icon: '📝', category: 'dil',      awards: [{ statId: 'zihin', xp: 12 }] },

  // --- Yazılım (ek) ---
  { id: 'bug_fix',     name: 'Hata (bug) çözdüm',       icon: '🐛', category: 'kod',      awards: [{ statId: 'zihin', xp: 18 }] },
  { id: 'code_review', name: 'Kod inceledim',           icon: '🔍', category: 'kod',      awards: [{ statId: 'zihin', xp: 12 }] },
  { id: 'acik_kaynak', name: 'Açık kaynağa katkı',      icon: '🌐', category: 'kod',      awards: [{ statId: 'zihin', xp: 20 }, { statId: 'sosyallik', xp: 5 }] },
  { id: 'deploy',      name: 'Proje yayınladım',        icon: '🚀', category: 'kod',      awards: [{ statId: 'zihin', xp: 15 }, { statId: 'duzen', xp: 5 }] },

  // --- Beslenme (ek) ---
  { id: 'kahvalti',    name: 'Sağlıklı kahvaltı yaptım', icon: '🍳', category: 'beslenme', awards: [{ statId: 'saglik', xp: 10 }], dailyLimit: 1 },
  { id: 'sebze_meyve', name: 'Sebze/meyve yedim',       icon: '🥦', category: 'beslenme', awards: [{ statId: 'saglik', xp: 8 }] },
  { id: 'yemek_yaptim',name: 'Kendim yemek yaptım',     icon: '👨‍🍳', category: 'beslenme', awards: [{ statId: 'saglik', xp: 12 }, { statId: 'yaraticilik', xp: 4 }] },
  { id: 'sekersiz_gun',name: 'Şekersiz gün geçirdim',   icon: '🚫', category: 'beslenme', awards: [{ statId: 'saglik', xp: 12 }, { statId: 'disiplin', xp: 4 }], dailyLimit: 1 },
  { id: 'bitki_cayi',  name: 'Bitki çayı içtim',        icon: '🍵', category: 'beslenme', awards: [{ statId: 'saglik', xp: 4 }], dailyLimit: 3 },

  // --- Öz bakım / uyku (ek) ---
  { id: 'zamaninda_yat', name: 'Zamanında yattım',      icon: '🌙', category: 'oz_bakim', awards: [{ statId: 'saglik', xp: 12 }, { statId: 'disiplin', xp: 4 }], dailyLimit: 1 },
  { id: 'kestirme',    name: 'Şekerleme yaptım',        icon: '💤', category: 'uyku',     awards: [{ statId: 'saglik', xp: 6 }], dailyLimit: 1 },
  { id: 'cilt_bakim',  name: 'Cilt/vücut bakımı',       icon: '🧖', category: 'oz_bakim', awards: [{ statId: 'saglik', xp: 5 }], dailyLimit: 1 },

  // --- Zihinsel / huzur (ek) ---
  { id: 'niyet',       name: 'Günün niyetini belirledim', icon: '🎯', category: 'zihinsel', awards: [{ statId: 'huzur', xp: 5 }, { statId: 'duzen', xp: 3 }], dailyLimit: 1 },
  { id: 'farkindalik', name: 'Farkındalık molası',      icon: '🌿', category: 'zihinsel', awards: [{ statId: 'huzur', xp: 6 }] },
  { id: 'digital_detoks', name: 'Dijital detoks yaptım', icon: '📴', category: 'zihinsel', awards: [{ statId: 'huzur', xp: 8 }, { statId: 'saglik', xp: 4 }] },
  { id: 'muzik_dinle', name: 'Rahatlatıcı müzik dinledim', icon: '🎶', category: 'zihinsel', awards: [{ statId: 'huzur', xp: 5 }] },

  // --- Görev / üretkenlik (ek) ---
  { id: 'derin_calisma', name: 'Derin çalışma yaptım',  icon: '🧠', category: 'gorev',    awards: [{ statId: 'zihin', xp: 12 }, { statId: 'duzen', xp: 8 }] },
  { id: 'todo_bitir',  name: 'To-do listemi bitirdim',  icon: '📋', category: 'gorev',    awards: [{ statId: 'duzen', xp: 15 }, { statId: 'disiplin', xp: 4 }] },
  { id: 'odak_engel',  name: 'Dikkat dağıtıcıyı kapattım', icon: '🔕', category: 'gorev', awards: [{ statId: 'duzen', xp: 6 }, { statId: 'disiplin', xp: 3 }] },

  // --- Ev & Yaşam ---
  { id: 'oda_topla',   name: 'Odamı topladım',          icon: '🧺', category: 'ev',       awards: [{ statId: 'duzen', xp: 12 }] },
  { id: 'bulasik',     name: 'Bulaşık/çamaşır yaptım',   icon: '🧼', category: 'ev',       awards: [{ statId: 'duzen', xp: 10 }] },
  { id: 'yemek_hazirlik', name: 'Yemek hazırlığı yaptım', icon: '🥘', category: 'ev',      awards: [{ statId: 'duzen', xp: 12 }, { statId: 'saglik', xp: 4 }] },
  { id: 'alisveris',   name: 'Market alışverişi yaptım', icon: '🛒', category: 'ev',       awards: [{ statId: 'duzen', xp: 8 }] },
  { id: 'ev_tamir',    name: 'Ev işi/tamirat hallettim', icon: '🔧', category: 'ev',       awards: [{ statId: 'duzen', xp: 12 }, { statId: 'yaraticilik', xp: 3 }] },

  // --- Finans (ek) ---
  { id: 'fatura_ode',  name: 'Ödemeleri hallettim',     icon: '🧾', category: 'finans',   awards: [{ statId: 'duzen', xp: 10 }] },
  { id: 'yatirim_yap', name: 'Yatırım/birikim ekledim',  icon: '💹', category: 'finans',   awards: [{ statId: 'duzen', xp: 12 }, { statId: 'disiplin', xp: 4 }] },

  // --- Sosyal (ek) ---
  { id: 'arkadas_bulus', name: 'Arkadaşla buluştum',    icon: '🧑‍🤝‍🧑', category: 'sosyal', awards: [{ statId: 'sosyallik', xp: 20 }] },
  { id: 'telefon_et',  name: 'Sevdiğimi aradım',        icon: '📞', category: 'sosyal',   awards: [{ statId: 'sosyallik', xp: 12 }] },
  { id: 'tesekkur_et', name: 'Birine teşekkür ettim',   icon: '🙏', category: 'sosyal',   awards: [{ statId: 'sosyallik', xp: 8 }, { statId: 'huzur', xp: 3 }] },
  { id: 'gonullu',     name: 'Gönüllü iş yaptım',       icon: '❤️', category: 'sosyal',   awards: [{ statId: 'sosyallik', xp: 18 }, { statId: 'disiplin', xp: 5 }] },
  { id: 'tanis',       name: 'Yeni biriyle tanıştım',   icon: '🤝', category: 'sosyal',   awards: [{ statId: 'sosyallik', xp: 15 }, { statId: 'merak', xp: 3 }] },

  // --- Hobi / yaratıcılık (ek) ---
  { id: 'el_isi',      name: 'El işi/DIY yaptım',        icon: '🧶', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 18 }] },
  { id: 'bahce',       name: 'Bitki/bahçe baktım',      icon: '🪴', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 8 }, { statId: 'huzur', xp: 5 }] },
  { id: 'sarki',       name: 'Şarkı söyledim',          icon: '🎤', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 15 }] },
  { id: 'icerik_uret', name: 'Video/içerik ürettim',    icon: '🎬', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 18 }, { statId: 'duzen', xp: 4 }] },
  { id: 'fikir',       name: 'Beyin fırtınası yaptım',  icon: '💭', category: 'hobi',     awards: [{ statId: 'yaraticilik', xp: 12 }, { statId: 'merak', xp: 4 }] },
];

// Özel eylem oluştururken kullanılabilecek ikonlar.
export const ICON_CHOICES = [
  '🏃','🏋️','🚴','🏊','⚽','🧗','🚶','🤸',
  '📚','📖','✍️','💡','🎓','🧠','🔬','🌐',
  '🗣️','🔤','🇬🇧','🇪🇸','🇯🇵','🇩🇪','🇫🇷','🌍',
  '💻','🧩','🛠️','📼','📄','⌨️','🖥️','🐛',
  '🥗','💧','🍎','🥦','😴','☕','🍵','💊',
  '🧘','🕯️','🎯','✅','🗓️','🧹','🗂️','💼',
  '💬','🤝','❤️','🎁','📞','👨‍👩‍👧','🎨','🎸',
  '🎮','📷','🎬','🌱','✨','⭐','🔥','⚡',
  '💰','🐷','📈','📊','🔭','🕊️','🌅','🌙',
];

// Rozet/başarım tanımları. check(sum) -> bool. Yeni başarım eklemek için
// bu listeye giriş eklemek yeterli. `reward` opsiyonel: açılınca kozmetik ödül verir.

export const ACHIEVEMENTS = [
  { id: 'ilk_adim',   name: 'İlk Adım',       icon: '👣', category: 'baslangic', desc: 'İlk eylemini kaydet.',                         check: (s) => s.totalActions >= 1 },
  { id: 'ilk_seviye', name: 'İlk Zafer',      icon: '🎉', category: 'baslangic', desc: 'İlk kez seviye atla.',                         check: (s) => s.leveledUpOnce },
  { id: 'ozel_eylem', name: 'Yaratıcı Ruh',   icon: '🛠️', category: 'baslangic', desc: 'Kendi özel eylemini oluştur.',                 check: (s) => s.hasCustomType },

  { id: 'eylem_50',   name: 'Azimli',         icon: '🔩', category: 'emek',      desc: '50 eylem kaydet.',                             check: (s) => s.totalActions >= 50 },
  { id: 'yuz_eylem',  name: 'Yüz Kere',       icon: '💯', category: 'emek',      desc: '100 eylem kaydet.',                            check: (s) => s.totalActions >= 100 },
  { id: 'eylem_500',  name: 'Efsanevi Emek',  icon: '🏆', category: 'emek',      desc: '500 eylem kaydet.',                            check: (s) => s.totalActions >= 500 },

  { id: 'seri_7',     name: 'Alevlenen',      icon: '🔥', category: 'seri',      desc: 'Bir eylemde 7 günlük seri yakala.',           check: (s) => s.longestStreakAny >= 7 },
  { id: 'seri_30',    name: 'Sarsılmaz',      icon: '⛰️', category: 'seri',      desc: 'Bir eylemde 30 günlük seri yakala.',          check: (s) => s.longestStreakAny >= 30 },
  { id: 'seri_100',   name: 'Çelik İrade',    icon: '🗡️', category: 'seri',      desc: 'Bir eylemde 100 günlük seri yakala.',         check: (s) => s.longestStreakAny >= 100 },
  { id: 'aktif_7',    name: 'Haftalık Ritim', icon: '📅', category: 'seri',      desc: '7 gün üst üste aktif ol.',                    check: (s) => s.longestOverallStreak >= 7 },
  { id: 'aktif_30',   name: 'Aylık Ritim',    icon: '🌙', category: 'seri',      desc: '30 gün üst üste aktif ol.',                   check: (s) => s.longestOverallStreak >= 30 },

  { id: 'beden_usta', name: 'Kudret',         icon: '💪', category: 'stat',      desc: 'Beden statını 20. seviyeye getir.',           check: (s) => (s.statLevels.beden || 0) >= 20 },
  { id: 'zihin_usta', name: 'Bilgelik',       icon: '🦉', category: 'stat',      desc: 'Zihin statını 20. seviyeye getir.',           check: (s) => (s.statLevels.zihin || 0) >= 20 },
  { id: 'hepsi_5',    name: 'Uyanış',         icon: '🌅', category: 'stat',      desc: 'Tüm ana statları 5. seviyeye getir.',         check: (s) => s.minMainLevel >= 5 },
  { id: 'hepsi_10',   name: 'Denge',          icon: '☯️', category: 'stat',      desc: 'Tüm ana statları 10. seviyeye getir.',        check: (s) => s.minMainLevel >= 10 },

  { id: 'hepsi_20',   name: 'Efsanevi Denge', icon: '🌟', category: 'stat',      desc: 'Tüm ana statları 20. seviyeye getir.',        check: (s) => s.minMainLevel >= 20 },
  { id: 'yaratici_usta', name: 'Sanatçı Ruh', icon: '🎨', category: 'stat',      desc: 'Yaratıcılık statını 20. seviyeye getir.',     check: (s) => (s.statLevels.yaraticilik || 0) >= 20 },
  { id: 'disiplin_usta', name: 'Demir Disiplin', icon: '🛡️', category: 'stat',  desc: 'Disiplin statını 15. seviyeye getir.',        check: (s) => (s.statLevels.disiplin || 0) >= 15 },

  { id: 'kod_50',     name: 'Kodlayıcı',      icon: '💻', category: 'ozel',      desc: '50 yazılım eylemi kaydet.',                   check: (s) => (s.categoryCounts.kod || 0) >= 50 },
  { id: 'dil_50',     name: 'Poliglot',       icon: '🗣️', category: 'ozel',      desc: '50 dil eylemi kaydet.',                       check: (s) => (s.categoryCounts.dil || 0) >= 50 },
  { id: 'hareket_50', name: 'Yorulmaz',       icon: '🏃', category: 'ozel',      desc: '50 hareket eylemi kaydet.',                   check: (s) => (s.categoryCounts.hareket || 0) >= 50 },
  { id: 'erken_kus',  name: 'Erken Kuş',      icon: '🌅', category: 'ozel',      desc: '10 kez erken kalktığını kaydet.',             check: (s) => (s.actionTypeCounts.erken_kalk || 0) >= 10 },
  { id: 'plan_kurucu',name: 'Planlı',         icon: '🗓️', category: 'ozel',      desc: 'Kendi günlük planını oluştur.',               check: (s) => s.routineCount >= 1 },

  { id: 'seviye_10',  name: 'Kahraman Yolu',  icon: '⭐', category: 'ilerleme',  desc: 'Karakter seviyeni 10 yap.',                   check: (s) => s.characterLevel >= 10 },
  { id: 'seviye_25',  name: 'Yükseliş',       icon: '🌟', category: 'ilerleme',  desc: 'Karakter seviyeni 25 yap.',                   check: (s) => s.characterLevel >= 25 },
  { id: 'seviye_50',  name: 'Zirve',          icon: '👑', category: 'ilerleme',  desc: 'Karakter seviyeni 50 yap.',                   check: (s) => s.characterLevel >= 50 },
  { id: 'gece_kusu',  name: 'Gece Nöbeti',    icon: '🌌', category: 'ozel',      desc: 'Gece yarısı ile sabah 4 arasında bir eylem kaydet.', check: (s) => s.nightAction },

  // --- Emek (ek) ---
  { id: 'eylem_10',   name: 'Isınıyor',       icon: '🌱', category: 'emek',      desc: '10 eylem kaydet.',                            check: (s) => s.totalActions >= 10 },
  { id: 'eylem_25',   name: 'Alışkanlık',     icon: '🌿', category: 'emek',      desc: '25 eylem kaydet.',                            check: (s) => s.totalActions >= 25 },
  { id: 'eylem_250',  name: 'Kararlı',        icon: '🔨', category: 'emek',      desc: '250 eylem kaydet.',                           check: (s) => s.totalActions >= 250 },
  { id: 'eylem_750',  name: 'Durdurulamaz',   icon: '🚀', category: 'emek',      desc: '750 eylem kaydet.',                           check: (s) => s.totalActions >= 750 },
  { id: 'eylem_2000', name: 'Yaşam Ustası',   icon: '🌌', category: 'emek',      desc: '2000 eylem kaydet.',                          check: (s) => s.totalActions >= 2000 },
  { id: 'notlu_25',   name: 'Günlükçü',       icon: '📔', category: 'emek',      desc: 'Nota sahip 25 eylem kaydet.',                 check: (s) => s.actionsWithNotes >= 25 },
  { id: 'gorev_25',   name: 'Görev Avcısı',   icon: '🎯', category: 'emek',      desc: '25 görev tamamla.',                           check: (s) => s.questsCompleted >= 25 },
  { id: 'gorev_100',  name: 'Görev Efsanesi', icon: '🏹', category: 'emek',      desc: '100 görev tamamla.',                          check: (s) => s.questsCompleted >= 100 },

  // --- Seri (ek) ---
  { id: 'seri_3',     name: 'Kıvılcım',       icon: '✨', category: 'seri',      desc: 'Bir eylemde 3 günlük seri yakala.',           check: (s) => s.longestStreakAny >= 3 },
  { id: 'seri_14',    name: 'İki Hafta',      icon: '🔥', category: 'seri',      desc: 'Bir eylemde 14 günlük seri yakala.',          check: (s) => s.longestStreakAny >= 14 },
  { id: 'seri_50',    name: 'Yarım Yüz',      icon: '🌋', category: 'seri',      desc: 'Bir eylemde 50 günlük seri yakala.',          check: (s) => s.longestStreakAny >= 50 },
  { id: 'seri_200',   name: 'Kutup Yıldızı',  icon: '⭐', category: 'seri',      desc: 'Bir eylemde 200 günlük seri yakala.',         check: (s) => s.longestStreakAny >= 200 },
  { id: 'seri_365',   name: 'Bir Yıl!',       icon: '🎆', category: 'seri',      desc: 'Bir eylemde 365 günlük seri yakala.',         check: (s) => s.longestStreakAny >= 365 },
  { id: 'aktif_14',   name: 'İki Hafta Ritim', icon: '📅', category: 'seri',     desc: '14 gün üst üste aktif ol.',                   check: (s) => s.longestOverallStreak >= 14 },
  { id: 'aktif_100',  name: 'Yüz Gün Ritmi',  icon: '🌙', category: 'seri',      desc: '100 gün üst üste aktif ol.',                  check: (s) => s.longestOverallStreak >= 100 },

  // --- Stat (ek) ---
  { id: 'saglik_usta',name: 'Şifa Ustası',    icon: '❤️', category: 'stat',      desc: 'Sağlık statını 20. seviyeye getir.',          check: (s) => (s.statLevels.saglik || 0) >= 20 },
  { id: 'duzen_usta', name: 'Baş Mimar',      icon: '🏛️', category: 'stat',      desc: 'Düzen statını 20. seviyeye getir.',           check: (s) => (s.statLevels.duzen || 0) >= 20 },
  { id: 'sosyal_usta',name: 'Elçi',           icon: '🤝', category: 'stat',      desc: 'Sosyallik statını 15. seviyeye getir.',       check: (s) => (s.statLevels.sosyallik || 0) >= 15 },
  { id: 'merak_usta', name: 'Kâşif Zihin',    icon: '🔭', category: 'stat',      desc: 'Merak statını 15. seviyeye getir.',           check: (s) => (s.statLevels.merak || 0) >= 15 },
  { id: 'huzur_usta', name: 'Dingin Ruh',     icon: '🕊️', category: 'stat',      desc: 'Huzur statını 15. seviyeye getir.',           check: (s) => (s.statLevels.huzur || 0) >= 15 },
  { id: 'hepsi_15',   name: 'Kusursuz Denge', icon: '💠', category: 'stat',      desc: 'Tüm ana statları 15. seviyeye getir.',        check: (s) => s.minMainLevel >= 15 },

  // --- Keşif ---
  { id: 'cesitli_10', name: 'Çok Yönlü',      icon: '🎭', category: 'kesif',     desc: '10 farklı eylem türü dene.',                  check: (s) => s.distinctTypesUsed >= 10 },
  { id: 'cesitli_20', name: 'Rönesans İnsanı',icon: '🧭', category: 'kesif',     desc: '20 farklı eylem türü dene.',                  check: (s) => s.distinctTypesUsed >= 20 },
  { id: 'dil_10',     name: 'Merhaba Dünya',  icon: '👋', category: 'kesif',     desc: '10 dil eylemi kaydet.',                       check: (s) => (s.categoryCounts.dil || 0) >= 10 },
  { id: 'kod_10',     name: 'İlk Commit',     icon: '⌨️', category: 'kesif',     desc: '10 yazılım eylemi kaydet.',                   check: (s) => (s.categoryCounts.kod || 0) >= 10 },
  { id: 'saglikci',   name: 'Sağlık Elçisi',  icon: '🥦', category: 'kesif',     desc: '30 beslenme eylemi kaydet.',                  check: (s) => (s.categoryCounts.beslenme || 0) >= 30 },

  // --- Ritim ---
  { id: 'ilk_isik',   name: 'İlk Işık',       icon: '🌄', category: 'ritim',     desc: 'Sabah 5-8 arası bir eylem kaydet.',           check: (s) => s.earlyAction },
  { id: 'hafta_sonu', name: 'Hafta Sonu Savaşçısı', icon: '🏕️', category: 'ritim', desc: 'Hafta sonu bir eylem kaydet.',            check: (s) => s.weekendAction },
  { id: 'dolu_gun',   name: 'Dolu Dolu',      icon: '🌟', category: 'ritim',     desc: 'Bir günde 200+ XP kazan.',                    check: (s) => s.bestDayXp >= 200 },
  { id: 'efsane_gun', name: 'Efsane Gün',     icon: '💫', category: 'ritim',     desc: 'Bir günde 500+ XP kazan.',                    check: (s) => s.bestDayXp >= 500 },
  { id: 'inanilmaz_gun', name: 'İnanılmaz Gün', icon: '☄️', category: 'ritim',   desc: 'Bir günde 1000+ XP kazan.',                   check: (s) => s.bestDayXp >= 1000 },

  // --- Ek dolgu rozetler ---
  { id: 'gorev_50',   name: 'Görev Ustası',   icon: '🎖️', category: 'emek',      desc: '50 görev tamamla.',                           check: (s) => s.questsCompleted >= 50 },
  { id: 'notlu_100',  name: 'Kronikçi',       icon: '🖋️', category: 'emek',      desc: 'Nota sahip 100 eylem kaydet.',                check: (s) => s.actionsWithNotes >= 100 },
  { id: 'cesitli_30', name: 'Sınır Tanımaz',  icon: '🌐', category: 'kesif',     desc: '30 farklı eylem türü dene.',                  check: (s) => s.distinctTypesUsed >= 30 },
  { id: 'aktif_200',  name: 'İki Yüz Gün',    icon: '🗓️', category: 'seri',      desc: '200 gün üst üste aktif ol.',                  check: (s) => s.longestOverallStreak >= 200 },
  { id: 'kod_100',    name: 'Yazılım Gurusu', icon: '🖥️', category: 'kesif',     desc: '100 yazılım eylemi kaydet.',                  check: (s) => (s.categoryCounts.kod || 0) >= 100 },
  { id: 'dil_100',    name: 'Dil Bilgini',    icon: '📖', category: 'kesif',     desc: '100 dil eylemi kaydet.',                      check: (s) => (s.categoryCounts.dil || 0) >= 100 },
  { id: 'hareket_100',name: 'Demir Beden',    icon: '🦿', category: 'kesif',     desc: '100 hareket eylemi kaydet.',                  check: (s) => (s.categoryCounts.hareket || 0) >= 100 },
  { id: 'tam_denge',  name: 'Mutlak Denge',   icon: '🧿', category: 'stat',      desc: 'Tüm statları (ikincil dahil) 10. seviyeye getir.', check: (s) => s.minAllLevel >= 10 },
  { id: 'seviye_40',  name: 'Efsanevi Yol',   icon: '🌠', category: 'ilerleme',  desc: 'Karakter seviyeni 40 yap.',                   check: (s) => s.characterLevel >= 40 },
];

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'baslangic', name: 'Başlangıç' },
  { id: 'emek',      name: 'Emek' },
  { id: 'seri',      name: 'Seriler' },
  { id: 'stat',      name: 'Statlar' },
  { id: 'kesif',     name: 'Keşif' },
  { id: 'ritim',     name: 'Ritim' },
  { id: 'ilerleme',  name: 'İlerleme' },
  { id: 'ozel',      name: 'Özel' },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

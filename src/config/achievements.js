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
];

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'baslangic', name: 'Başlangıç' },
  { id: 'emek',      name: 'Emek' },
  { id: 'seri',      name: 'Seriler' },
  { id: 'stat',      name: 'Statlar' },
  { id: 'ilerleme',  name: 'İlerleme' },
  { id: 'ozel',      name: 'Özel' },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

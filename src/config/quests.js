// Görev şablonları. criteria.kind: action_count | distinct_types | distinct_stats
// | active_days | any_action | manual. match: {actionTypeId?|category?|statId?}
// reward: {statId, xp}. period: 'day' (günlük/yan) | 'week' (haftalık).

export const DAILY_POOL = [
  { id: 'd_move',   title: 'Bedenini hareket ettir',   icon: '🏃', criteria: { kind: 'action_count', match: { category: 'hareket' }, target: 1 }, reward: { statId: 'disiplin', xp: 15 } },
  { id: 'd_water',  title: '4 bardak su iç',           icon: '💧', criteria: { kind: 'action_count', match: { actionTypeId: 'su' }, target: 4 },    reward: { statId: 'saglik', xp: 12 } },
  { id: 'd_learn',  title: 'Bir şeyler öğren',         icon: '📚', criteria: { kind: 'action_count', match: { category: 'ogrenme' }, target: 1 }, reward: { statId: 'zihin', xp: 15 } },
  { id: 'd_task',   title: 'Bir görev bitir',          icon: '✅', criteria: { kind: 'action_count', match: { category: 'gorev' }, target: 1 },   reward: { statId: 'duzen', xp: 15 } },
  { id: 'd_three',  title: '3 farklı eylem yap',       icon: '🎲', criteria: { kind: 'distinct_types', target: 3 },                                reward: { statId: 'disiplin', xp: 20 } },
  { id: 'd_social', title: 'Biriyle vakit geçir',      icon: '💬', criteria: { kind: 'action_count', match: { category: 'sosyal' }, target: 1 },  reward: { statId: 'sosyallik', xp: 15 } },
  { id: 'd_mind',   title: 'Zihnini dinlendir',        icon: '🧘', criteria: { kind: 'action_count', match: { actionTypeId: 'meditasyon' }, target: 1 }, reward: { statId: 'saglik', xp: 12 } },
  { id: 'd_active', title: 'Günü aktif geçir',         icon: '⚡', criteria: { kind: 'any_action', target: 2 },                                    reward: { statId: 'disiplin', xp: 15 } },
  { id: 'd_lang',   title: 'Bir dil çalış',            icon: '🗣️', criteria: { kind: 'action_count', match: { category: 'dil' }, target: 1 },     reward: { statId: 'merak', xp: 15 } },
  { id: 'd_code',   title: 'Yazılım/kod çalış',        icon: '💻', criteria: { kind: 'action_count', match: { category: 'kod' }, target: 1 },     reward: { statId: 'zihin', xp: 18 } },
  { id: 'd_move2',  title: 'Gün içinde 2 kez hareket', icon: '🏃', criteria: { kind: 'action_count', match: { category: 'hareket' }, target: 2 }, reward: { statId: 'beden', xp: 20 } },
  { id: 'd_calm',   title: 'Zihnini dinlendir',        icon: '🕊️', criteria: { kind: 'action_count', match: { category: 'zihinsel' }, target: 1 }, reward: { statId: 'huzur', xp: 15 } },
  { id: 'd_selfcare', title: 'Kendine iyi bak',        icon: '🧴', criteria: { kind: 'action_count', match: { category: 'oz_bakim' }, target: 1 }, reward: { statId: 'saglik', xp: 12 } },
];

export const WEEKLY_POOL = [
  { id: 'w_move5',    title: 'Bu hafta 5 kez hareket et',        icon: '🏋️', criteria: { kind: 'action_count', match: { category: 'hareket' }, target: 5 }, reward: { statId: 'beden', xp: 70 } },
  { id: 'w_learn4',   title: 'Bu hafta 4 kez öğren',            icon: '🎓', criteria: { kind: 'action_count', match: { category: 'ogrenme' }, target: 4 }, reward: { statId: 'zihin', xp: 70 } },
  { id: 'w_balance',  title: 'Bu hafta 4 farklı statı geliştir', icon: '⚖️', criteria: { kind: 'distinct_stats', target: 4 },                              reward: { statId: 'disiplin', xp: 80 } },
  { id: 'w_active6',  title: 'Bu hafta 6 gün aktif ol',         icon: '📆', criteria: { kind: 'active_days', target: 6 },                                 reward: { statId: 'disiplin', xp: 100 } },
  { id: 'w_actions20',title: 'Bu hafta 20 eylem kaydet',        icon: '📈', criteria: { kind: 'any_action', target: 20 },                                 reward: { statId: 'disiplin', xp: 80 } },
  { id: 'w_lang5',    title: 'Bu hafta 5 kez dil çalış',        icon: '🗣️', criteria: { kind: 'action_count', match: { category: 'dil' }, target: 5 },    reward: { statId: 'merak', xp: 70 } },
  { id: 'w_code5',    title: 'Bu hafta 5 kez yazılım çalış',    icon: '💻', criteria: { kind: 'action_count', match: { category: 'kod' }, target: 5 },    reward: { statId: 'zihin', xp: 70 } },
  { id: 'w_calm4',    title: 'Bu hafta 4 kez dinginlik anı',    icon: '🧘', criteria: { kind: 'action_count', match: { category: 'zihinsel' }, target: 4 }, reward: { statId: 'huzur', xp: 60 } },
  { id: 'w_variety',  title: 'Bu hafta 8 farklı eylem dene',    icon: '🎲', criteria: { kind: 'distinct_types', target: 8 },                              reward: { statId: 'disiplin', xp: 90 } },
];

export const SIDE_POOL = [
  { id: 's_nosugar',   title: 'Bugün hiç şeker yeme',           icon: '🍭', criteria: { kind: 'manual' },                                              reward: { statId: 'saglik', xp: 25 } },
  { id: 's_walk',      title: 'Kısa bir yürüyüşe çık',          icon: '🚶', criteria: { kind: 'action_count', match: { actionTypeId: 'yuruyus' }, target: 1 }, reward: { statId: 'beden', xp: 20 } },
  { id: 's_gratitude', title: '3 şeye minnettar ol',           icon: '🙏', criteria: { kind: 'manual' },                                              reward: { statId: 'saglik', xp: 15 } },
  { id: 's_declutter', title: 'Bir köşeni topla',              icon: '🧹', criteria: { kind: 'action_count', match: { actionTypeId: 'temizlik' }, target: 1 }, reward: { statId: 'duzen', xp: 20 } },
  { id: 's_call',      title: 'Sevdiğin birini ara',           icon: '📞', criteria: { kind: 'manual' },                                              reward: { statId: 'sosyallik', xp: 25 } },
  { id: 's_earlybed',  title: 'Bu gece erken yat',             icon: '🌙', criteria: { kind: 'manual' },                                              reward: { statId: 'saglik', xp: 20 } },
  { id: 's_read',      title: 'Birkaç sayfa oku',              icon: '📖', criteria: { kind: 'action_count', match: { actionTypeId: 'kitap' }, target: 1 }, reward: { statId: 'zihin', xp: 20 } },
  { id: 's_create',    title: 'Yaratıcı bir şey yap',          icon: '🎨', criteria: { kind: 'action_count', match: { category: 'hobi' }, target: 1 },  reward: { statId: 'yaraticilik', xp: 25 } },
  { id: 's_word',      title: '5 yeni kelime öğren',           icon: '🔤', criteria: { kind: 'action_count', match: { actionTypeId: 'kelime' }, target: 5 }, reward: { statId: 'merak', xp: 20 } },
  { id: 's_water8',    title: 'Bugün 8 bardak su iç',          icon: '💧', criteria: { kind: 'action_count', match: { actionTypeId: 'su' }, target: 8 }, reward: { statId: 'saglik', xp: 20 } },
  { id: 's_sun',       title: 'Dışarı çık, güneş/ışık al',     icon: '🌤️', criteria: { kind: 'manual' },                                              reward: { statId: 'huzur', xp: 15 } },
  { id: 's_focus',     title: 'Bir odak seansı tamamla',       icon: '⏱️', criteria: { kind: 'action_count', match: { actionTypeId: 'pomodoro' }, target: 1 }, reward: { statId: 'duzen', xp: 20 } },
];

// Sabit günlük görevler: her gün rastgele görevlere EK olarak gelir.
// escalate varsa hedef her yeni günde artar; title içindeki {n} sayıyla değişir.
export const FIXED_DAILY = [
  { id: 'fx_pushup', title: '{n} şınav çek',        icon: '💪', escalate: { start: 5, step: 1 },  criteria: { kind: 'manual' }, reward: { statId: 'beden', xp: 20 } },
  { id: 'fx_situp',  title: '{n} mekik çek',        icon: '🔥', escalate: { start: 10, step: 1 }, criteria: { kind: 'manual' }, reward: { statId: 'beden', xp: 20 } },
  { id: 'fx_walk',   title: '1 saat yürüyüşe çık',  icon: '🚶', criteria: { kind: 'manual' },                                    reward: { statId: 'beden', xp: 25 } },
  { id: 'fx_gym',    title: 'Spora git',            icon: '🏋️', criteria: { kind: 'action_count', match: { actionTypeId: 'spor' }, target: 1 }, reward: { statId: 'beden', xp: 25 } },
];

export const DAILY_COUNT = 5;
export const WEEKLY_COUNT = 3;

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
];

export const WEEKLY_POOL = [
  { id: 'w_move5',    title: 'Bu hafta 5 kez hareket et',        icon: '🏋️', criteria: { kind: 'action_count', match: { category: 'hareket' }, target: 5 }, reward: { statId: 'beden', xp: 70 } },
  { id: 'w_learn4',   title: 'Bu hafta 4 kez öğren',            icon: '🎓', criteria: { kind: 'action_count', match: { category: 'ogrenme' }, target: 4 }, reward: { statId: 'zihin', xp: 70 } },
  { id: 'w_balance',  title: 'Bu hafta 4 farklı statı geliştir', icon: '⚖️', criteria: { kind: 'distinct_stats', target: 4 },                              reward: { statId: 'disiplin', xp: 80 } },
  { id: 'w_active6',  title: 'Bu hafta 6 gün aktif ol',         icon: '📆', criteria: { kind: 'active_days', target: 6 },                                 reward: { statId: 'disiplin', xp: 100 } },
  { id: 'w_actions20',title: 'Bu hafta 20 eylem kaydet',        icon: '📈', criteria: { kind: 'any_action', target: 20 },                                 reward: { statId: 'disiplin', xp: 80 } },
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
];

export const DAILY_COUNT = 3;
export const WEEKLY_COUNT = 2;

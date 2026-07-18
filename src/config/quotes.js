// Günün motivasyon sözü (kural tabanlı, güne göre deterministik seçilir).
import { seededRandom, todayKey } from '../services/time.js';

export const QUOTES = [
  'Küçük adımlar, büyük maceralar başlatır.',
  'Bugün attığın her adım, yarınki kahramanını güçlendirir.',
  'Mükemmeli bekleme; başla, gerisi gelir.',
  'Seriyi korumak, motivasyonu beklemekten güçlüdür.',
  'Bir eylem = bir XP daha. Her şey sayılır.',
  'Yavaş git ama durma; ilerleme ilerlemedir.',
  'Disiplin, isteğin bittiği yerde başlar.',
  'Bugünün küçük zaferi, yarının alışkanlığıdır.',
  'Enerjin düşükse hedefi küçült, ama yine de yap.',
  'Kendine yatırım yapan hep kazanır.',
  'Zorluk, seni bir sonraki seviyeye taşıyan merdivendir.',
  'Bir günü kaçırmak yenilgi değil; ertesi gün geri dönmek zaferdir.',
  'Karakterini eylemlerinle inşa ediyorsun — kelimelerle değil.',
  'Bugün "başlamak için iyi bir gün".',
  'İlerlemeni ölç, kendini başkasıyla değil dünkü seninle kıyasla.',
  'Merak seni büyütür; her gün yeni bir şey öğren.',
  'Bedenine iyi bak, o seni bir ömür taşıyacak.',
  'Huzur da bir güçtür; nefes al, devam et.',
  'Büyük hedefler küçük günlük görevlerden doğar.',
  'Sen zaten yolun üzerindesin. Bir adım daha.',
];

export function quoteOfDay() {
  const rng = seededRandom('quote:' + todayKey());
  return QUOTES[Math.floor(rng() * QUOTES.length)];
}

# ⚔️ Gerçek Hayat RPG

Gerçek hayatını RPG'leştiren, **tamamen çevrimdışı** çalışan, **mobil öncelikli** bir alışkanlık takip uygulaması (PWA). Sunucu yok, hesap yok, yapay zeka yok — tüm verin yalnızca **senin cihazında** (IndexedDB) tutulur.

Her sağlıklı alışkanlık karakterine XP kazandırır; seviye atlar, seriler yakalar, görevleri tamamlar, rozetler ve kozmetik ödüller açarsın.

## ✨ Özellikler

- **Karakter sistemi** — 4 ana stat (Beden, Zihin, Sağlık, Düzen) + 3 ikincil stat (Disiplin, Sosyallik, Yaratıcılık). Her stat kendi seviyesine sahip, ayrıca toplam karakter seviyesi. En yüksek stat'a göre otomatik **sınıf** (Savaşçı/Bilge/Şifacı/Mimar) ve seviyeye göre **unvan**.
- **Eylem günlüğü** — Tek dokunuşla hızlı eylemler, kendi **özel eylemlerini** oluşturma (ikon + stat + XP + günlük limit), not ekleme, kategori filtresi ve **aranabilir, sanallaştırılmış** geçmiş.
- **Seri (streak) sistemi** — Her eylem için ayrı sayaç, 3/7/14/30 gün eşiklerinde artan XP çarpanı, genel aktiflik üst-serisi, nazik "serini koru" hatırlatmaları.
- **Nazik zorluk** — Ceza yerine uzun süre dokunulmayan statta çok küçük "paslanma"; bir eylemle anında durur, asla suçlayıcı dil yok.
- **Görevler & hedefler** — Otomatik rotasyonlu günlük/haftalık görevler, kullanıcı tanımlı görevler, uzun vadeli hedefler (ilerleme çubuğu) ve rastgele **yan görevler**.
- **Rütbe, başarım, envanter** — Rozet galerisi (kilitli olanlar siluet), kozmetik ödüller (avatar/tema rengi/unvan).
- **İstatistikler** — Stat gelişim grafikleri (çizgi/alan), radar dağılımı, kişisel rekorlar, kural tabanlı haftalık özet, "geçmişte bugün".
- **Arayüz** — Koyu/açık tema, canlı vurgu renkleri, yumuşak geçişler, seviye atlama konfetisi, tek elle kullanım için alt gezinme + FAB.
- **PWA** — "Ana ekrana ekle" ile gerçek uygulama gibi açılır, çevrimdışı çalışır.
- **Yedekleme** — JSON dışa/içe aktarma + otomatik günlük yerel yedek.

## 🚀 Yerelde çalıştırma

Herhangi bir statik sunucu yeterlidir (build adımı yok):

```bash
# Depo kökünde
python3 -m http.server 8080
# Tarayıcıda: http://localhost:8080
```

> Not: PWA/Service Worker için `http://localhost` veya `https://` gerekir; `file://` ile açma tam çalışmaz.

## 🌐 Önizleme (GitHub Pages)

Depoda `.github/workflows/deploy.yml` mevcut. Yayınlamak için **bir kez**:

1. GitHub'da: **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. `claude/life-rpg-habit-tracker-jac539` (veya `main`) dalına push yeterli — workflow otomatik dağıtır.

Yayınlandığında adres:

```
https://corvexis-rpg.github.io/Ger-ek-hayat-rpg/
```

Telefonda bu adresi açıp tarayıcı menüsünden **"Ana ekrana ekle"** diyerek uygulamayı kurabilirsin.

## 🏗️ Mimari

Vanilla JS (ES modülleri), sıfır bağımlılık. Grafikler ve konfeti elle SVG/Canvas ile çizilir.

```
index.html · manifest.webmanifest · sw.js
css/styles.css              → tasarım sistemi (token'lar, koyu/açık tema)
icons/                      → PWA ikonları (maskable dahil)
src/
  main.js router.js store.js db.js
  config/   → stats, quickActions, titles, achievements, quests, rewards
  domain/   → xp, streaks, rust, quests, achievements, stats, character
  services/ → time, backup, notifications, reminders
  ui/       → nav, actionForms, components/*, screens/*
```

Kod **genişlemeye açık**: yeni bir stat, eylem, görev veya başarım eklemek genellikle ilgili `config/*` dosyasına bir giriş eklemekle sınırlıdır.

## 🔒 Gizlilik

Tüm veri cihazında kalır. Hiçbir sunucuya veri gönderilmez. Verini JSON olarak dışa aktarıp yedekleyebilirsin.

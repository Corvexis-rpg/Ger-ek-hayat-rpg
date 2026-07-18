// Karakter kartı + ayarlar (tema, hatırlatmalar, yedekleme, sıfırlama).
import { el, haptic } from '../components/dom.js';
import { progressBar, statBar } from '../components/progressBar.js';
import { openSheet, close, confirmDialog } from '../components/sheet.js';
import { showToast } from '../components/toast.js';
import * as store from '../../store.js';
import { STATS, MAIN_STATS, SECONDARY_STATS } from '../../config/stats.js';
import { statLevelInfo } from '../../domain/xp.js';
import { characterInfo, deriveClass } from '../../domain/character.js';
import { titleForLevel, nextTitle, unlockedTitles } from '../../config/titles.js';
import { avatarById, AVATARS } from '../../config/rewards.js';
import { exportToFile, readBackupFile, getLocalBackupInfo, getLocalBackupData } from '../../services/backup.js';
import { requestPermission, permission } from '../../services/notifications.js';

export function renderCharacter() {
  const wrap = el('div', { class: 'page character' });
  const ch = store.state.character;
  const info = characterInfo(store.state.statProgress);
  const klass = deriveClass(store.state.statProgress);
  const title = titleForLevel(info.level);
  const nt = nextTitle(info.level);
  const avatar = avatarById(ch.avatarId);

  wrap.appendChild(el('div', { class: 'page-head' },
    el('a', { class: 'back-link', href: '#/home' }, '← Ana Sayfa'),
    el('h1', {}, 'Karakter')));

  // karakter kartı
  wrap.appendChild(el('div', { class: 'card char-card frame-' + (ch.frameId || 'none') },
    el('div', { class: 'char-avatar-big', onclick: openAvatarPicker }, avatar.emoji),
    el('div', { class: 'char-name-row' },
      el('h2', {}, ch.name),
      el('button', { class: 'icon-btn', onclick: openNameEdit }, '✏️')),
    el('div', { class: 'char-badges' },
      el('span', { class: 'class-badge big' }, klass.icon + ' ' + klass.name),
      el('span', { class: 'title-badge big' }, '“' + title.name + '”')),
    el('div', { class: 'char-level-box' },
      el('div', { class: 'clb-num' }, 'Seviye ' + info.level),
      progressBar(info.progress, { gradient: true, height: 12 }),
      el('div', { class: 'xp-caption' }, nt ? `Sonraki unvan: ${nt.name} (Sv ${nt.level})` : 'En yüksek unvana ulaştın! 👑')),
  ));

  // statların görsel temsili
  const statCard = el('div', { class: 'card' }, el('div', { class: 'card-head' }, el('h3', {}, 'Statlar')));
  for (const s of MAIN_STATS) statCard.appendChild(statBar(s, statLevelInfo(store.state.statProgress[s.id].xp)));
  statCard.appendChild(el('div', { class: 'divider' }));
  for (const s of SECONDARY_STATS) statCard.appendChild(statBar(s, statLevelInfo(store.state.statProgress[s.id].xp)));
  wrap.appendChild(statCard);

  // kazanılan unvanlar
  const titles = unlockedTitles(info.level);
  wrap.appendChild(el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, '📜 Kazanılan Unvanlar')),
    el('div', { class: 'title-chips' },
      ...titles.map((t) => el('span', { class: 'chip' + (t.id === title.id ? ' active' : '') }, t.name)))));

  // --- Ayarlar ---
  const s = store.settings();
  const settingsCard = el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, '⚙️ Ayarlar')),
    toggleRow('🌗 Açık tema', s.theme === 'light', (v) => store.setSetting('theme', v ? 'light' : 'dark')),
    toggleRow('🔔 Nazik hatırlatmalar', s.reminders, async (v) => {
      if (v && permission() !== 'granted') await requestPermission();
      store.setSetting('reminders', v);
    }),
    toggleRow('💾 Otomatik yerel yedek', s.autoBackup, (v) => store.setSetting('autoBackup', v)),
  );
  wrap.appendChild(settingsCard);

  // --- Yedekleme ---
  const bi = getLocalBackupInfo();
  const fileInput = el('input', { type: 'file', accept: 'application/json', class: 'hidden',
    onchange: async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const data = await readBackupFile(file);
        if (await confirmDialog({ title: 'Yedeği geri yükle', message: 'Mevcut tüm verinin üzerine yazılacak. Devam edilsin mi?', confirmText: 'Geri yükle', danger: true })) {
          await store.importData(data);
          showToast('Veriler geri yüklendi ✅', 'success');
          location.hash = '#/home';
        }
      } catch (err) { showToast('Geçersiz yedek dosyası', 'error'); }
      e.target.value = '';
    } });

  wrap.appendChild(el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h3', {}, '💾 Yedekleme')),
    el('p', { class: 'muted small' }, bi ? `Son otomatik yedek: ${bi.day}` : 'Tüm veri yalnızca bu cihazda tutulur.'),
    el('div', { class: 'btn-col' },
      el('button', { class: 'btn primary full', onclick: () => { exportToFile(); showToast('Yedek indiriliyor 📤', 'info'); } }, '📤 JSON olarak dışa aktar'),
      el('button', { class: 'btn ghost full', onclick: () => fileInput.click() }, '📥 Yedekten içe aktar'),
      bi ? el('button', { class: 'btn ghost full', onclick: async () => {
        const data = getLocalBackupData();
        if (data && await confirmDialog({ title: 'Otomatik yedeğe dön', message: `${bi.day} tarihli otomatik yedeğe dönülsün mü?`, confirmText: 'Geri yükle' })) {
          await store.importData(data); showToast('Otomatik yedek geri yüklendi', 'success'); location.hash = '#/home';
        }
      } }, '♻️ Otomatik yedeğe dön') : null,
    ),
    fileInput,
  ));

  // --- Tehlikeli bölge ---
  wrap.appendChild(el('div', { class: 'card danger-zone' },
    el('div', { class: 'card-head' }, el('h3', {}, '⚠️ Sıfırlama')),
    el('p', { class: 'muted small' }, 'İlerlemeyi sıfırla: tüm XP, seri, eylem geçmişi, başarım ve ödüller silinir; karakterin, özel eylemlerin ve planın korunur.'),
    el('button', { class: 'btn full', style: { marginBottom: '10px' }, onclick: async () => {
      if (await confirmDialog({ title: 'İlerlemeyi sıfırla', message: 'Tüm XP, seri, eylem geçmişi, başarım ve ödüller sıfırlanacak. Karakterin ve özel eylemlerin kalır. Devam edilsin mi?', confirmText: 'İlerlemeyi sıfırla', danger: true })) {
        await store.resetProgress(); showToast('İlerleme sıfırlandı', 'info'); location.hash = '#/home';
      }
    } }, '♻️ Sadece ilerlemeyi sıfırla'),
    el('div', { class: 'divider' }),
    el('p', { class: 'muted small' }, 'Hesabı sil: karakter dahil HER ŞEY silinir ve uygulama sıfırdan başlar. Geri alınamaz.'),
    el('button', { class: 'btn danger full', onclick: async () => {
      if (await confirmDialog({ title: 'Hesabı ve her şeyi sil', message: 'Karakter, eylemler, özel eylemler, plan — tüm veri kalıcı olarak silinecek ve uygulama en baştan başlayacak. Emin misin?', confirmText: 'Her şeyi sil', danger: true })) {
        await store.resetAll(); location.hash = '#/home'; location.reload();
      }
    } }, '🗑️ Hesabı sil (her şeyi sıfırla)'),
  ));

  wrap.appendChild(el('div', { class: 'app-foot muted small' }, 'Gerçek Hayat RPG · Çevrimdışı · v1'));

  function rerender() { const p = wrap.parentNode; if (p) p.replaceChild(renderCharacter(), wrap); }

  function openNameEdit() {
    openSheet({ title: 'İsmi Düzenle', body: (content) => {
      let name = ch.name;
      content.append(
        el('input', { class: 'input', maxlength: 24, value: name, oninput: (e) => name = e.target.value }),
        el('div', { class: 'row-actions', style: { marginTop: '14px' } },
          el('button', { class: 'btn ghost', onclick: close }, 'Vazgeç'),
          el('button', { class: 'btn primary', onclick: async () => { await store.updateCharacter({ name: name.trim() || ch.name }); close(); rerender(); } }, 'Kaydet')),
      );
    } });
  }

  function openAvatarPicker() {
    openSheet({ title: 'Avatar Seç', body: (content) => {
      const grid = el('div', { class: 'avatar-grid' });
      for (const a of AVATARS) {
        const unlocked = store.rewardUnlocked(a.id);
        grid.appendChild(el('button', { class: 'avatar-opt' + (ch.avatarId === a.id ? ' active' : '') + (unlocked ? '' : ' locked'),
          onclick: async () => { if (!unlocked) { showToast('Bu avatar henüz kilitli 🔒', 'info'); return; } await store.equipReward('avatar', a.id); close(); rerender(); } },
          el('span', { class: 'ao-emoji' }, a.emoji),
          el('span', { class: 'ao-name' }, unlocked ? a.name : '🔒')));
      }
      content.appendChild(grid);
    } });
  }

  return wrap;
}

function toggleRow(label, checked, onChange) {
  const input = el('input', { type: 'checkbox', checked, onchange: (e) => { haptic(8); onChange(e.target.checked); } });
  return el('label', { class: 'toggle-row' },
    el('span', {}, label),
    el('span', { class: 'switch' }, input, el('span', { class: 'switch-slider' })),
  );
}

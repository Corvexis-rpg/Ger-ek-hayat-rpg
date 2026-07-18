// Hafif canvas konfeti/parıltı efekti (bağımsız, bağımlılıksız).
let canvas, ctx, running = false, particles = [];

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '9999',
  });
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const COLORS = ['#7c5cff', '#22d3ee', '#34d399', '#f59e0b', '#ff6b6b', '#f472b6', '#fbbf24'];

export function burst({ count = 90, origin = { x: 0.5, y: 0.4 }, spread = 1 } = {}) {
  ensureCanvas();
  const ox = origin.x * window.innerWidth;
  const oy = origin.y * window.innerHeight;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (2 + Math.random() * 7) * spread;
    particles.push({
      x: ox, y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      g: 0.14 + Math.random() * 0.1,
      size: 4 + Math.random() * 6,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1,
      decay: 0.008 + Math.random() * 0.01,
      shape: Math.random() < 0.5 ? 'rect' : 'circle',
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= p.decay;
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
  if (particles.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

// Küçük "artı XP" parıltısı için hafif versiyon
export function sparkle(x, y) {
  ensureCanvas();
  for (let i = 0; i < 14; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1,
      g: 0.05, size: 2 + Math.random() * 3, color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: 0, vr: 0, life: 1, decay: 0.03, shape: 'circle',
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

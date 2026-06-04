'use strict';

// ── State ──────────────────────────────────────────────
const state = {
  text: 'محمد',
  font: 'Amiri',
  fontWeight: '700',
  color: '#1a1a2e',
  fontSize: 120,
  frame: 'none',
  bgPreview: 'transparent',
};

// ── Canvas ──────────────────────────────────────────────
const canvas = document.getElementById('calligraphyCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_W = 800;
const CANVAS_H = 500;
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

// ── Ornament Paths ──────────────────────────────────────
function drawOrnateFrame(ctx, w, h, color) {
  const m = 18;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;

  // Outer rectangle
  roundRect(ctx, m, m, w - m * 2, h - m * 2, 10);
  ctx.stroke();

  // Inner rectangle
  roundRect(ctx, m + 12, m + 12, w - (m + 12) * 2, h - (m + 12) * 2, 6);
  ctx.stroke();

  // Corner ornaments
  const cs = 28;
  const corners = [
    [m, m], [w - m, m], [m, h - m], [w - m, h - m]
  ];
  corners.forEach(([cx, cy]) => drawCornerFlower(ctx, cx, cy, cs, color));

  // Top/bottom dividers
  const midX = w / 2;
  drawDiamond(ctx, midX, m, 12, color);
  drawDiamond(ctx, midX, h - m, 12, color);
  drawDiamond(ctx, m, h / 2, 10, color);
  drawDiamond(ctx, w - m, h / 2, 10, color);
}

function drawGeometricFrame(ctx, w, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const m = 20;

  // Star-like corners
  ctx.beginPath();
  ctx.rect(m, m, w - m * 2, h - m * 2);
  ctx.stroke();

  // Geometric corner cuts
  const cuts = 24;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(m + cuts, m); ctx.lineTo(m, m + cuts); ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(w - m - cuts, m); ctx.lineTo(w - m, m + cuts); ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(m + cuts, h - m); ctx.lineTo(m, h - m - cuts); ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(w - m - cuts, h - m); ctx.lineTo(w - m, h - m - cuts); ctx.stroke();

  // Inner diamond border
  const im = m + 10;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.rect(im, im, w - im * 2, h - im * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawFloralFrame(ctx, w, h, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.5;
  const m = 16;

  roundRect(ctx, m, m, w - m * 2, h - m * 2, 20);
  ctx.stroke();

  // Floral dots along edges
  const count = 14;
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const x1 = m + t * (w - m * 2);
    drawFlowerDot(ctx, x1, m, 4, color);
    drawFlowerDot(ctx, x1, h - m, 4, color);
  }
  for (let i = 1; i < count; i++) {
    const t = i / count;
    const y1 = m + t * (h - m * 2);
    drawFlowerDot(ctx, m, y1, 4, color);
    drawFlowerDot(ctx, w - m, y1, 4, color);
  }
}

function drawOvalFrame(ctx, w, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  const cx = w / 2, cy = h / 2;
  const rx = w / 2 - 20, ry = h / 2 - 20;

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx - 10, ry - 10, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Small dots around ellipse
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
    const px = cx + (rx - 5) * Math.cos(a);
    const py = cy + (ry - 5) * Math.sin(a);
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDiamondFrame(ctx, w, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  const cx = w / 2, cy = h / 2;
  const rx = w / 2 - 22, ry = h / 2 - 22;

  ctx.beginPath();
  ctx.moveTo(cx, cy - ry);
  ctx.lineTo(cx + rx, cy);
  ctx.lineTo(cx, cy + ry);
  ctx.lineTo(cx - rx, cy);
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry + 14);
  ctx.lineTo(cx + rx - 14, cy);
  ctx.lineTo(cx, cy + ry - 14);
  ctx.lineTo(cx - rx + 14, cy);
  ctx.closePath();
  ctx.stroke();

  drawDiamond(ctx, cx, cy - ry, 10, color);
  drawDiamond(ctx, cx + rx, cy, 10, color);
  drawDiamond(ctx, cx, cy + ry, 10, color);
  drawDiamond(ctx, cx - rx, cy, 10, color);
}

// ── Helper Shapes ───────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawDiamond(ctx, cx, cy, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size * 0.6, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size * 0.6, cy);
  ctx.closePath();
  ctx.fill();
}

function drawCornerFlower(ctx, cx, cy, size, color) {
  ctx.fillStyle = color;
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const px = cx + Math.cos(angle) * size * 0.5;
    const py = cy + Math.sin(angle) * size * 0.5;
    ctx.beginPath();
    ctx.arc(px, py, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlowerDot(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

// ── Main Render ─────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Background
  if (state.bgPreview === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  } else if (state.bgPreview === 'dark') {
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  } else if (state.bgPreview === 'parchment') {
    ctx.fillStyle = '#f5e6c8';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    // Subtle texture lines
    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let y = 0; y < CANVAS_H; y += 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }
  }
  // transparent: nothing drawn

  // Frame
  if (state.frame === 'ornate') drawOrnateFrame(ctx, CANVAS_W, CANVAS_H, state.color);
  else if (state.frame === 'geometric') drawGeometricFrame(ctx, CANVAS_W, CANVAS_H, state.color);
  else if (state.frame === 'floral') drawFloralFrame(ctx, CANVAS_W, CANVAS_H, state.color);
  else if (state.frame === 'oval') drawOvalFrame(ctx, CANVAS_W, CANVAS_H, state.color);
  else if (state.frame === 'diamond') drawDiamondFrame(ctx, CANVAS_W, CANVAS_H, state.color);

  // Text
  const fontStr = `${state.fontWeight} ${state.fontSize}px '${state.font}', serif`;
  ctx.font = fontStr;
  ctx.fillStyle = state.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = 'rtl';

  // Shadow / glow for dark backgrounds
  if (state.bgPreview === 'dark') {
    ctx.shadowColor = state.color;
    ctx.shadowBlur = 18;
  } else {
    ctx.shadowBlur = 0;
  }

  ctx.fillText(state.text || '...', CANVAS_W / 2, CANVAS_H / 2);
  ctx.shadowBlur = 0;
}

// ── Download ────────────────────────────────────────────
function downloadCanvas(transparent) {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = CANVAS_W;
  exportCanvas.height = CANVAS_H;
  const ectx = exportCanvas.getContext('2d');

  if (!transparent) {
    if (state.bgPreview === 'dark') {
      ectx.fillStyle = '#0d0d1a';
    } else if (state.bgPreview === 'parchment') {
      ectx.fillStyle = '#f5e6c8';
    } else {
      ectx.fillStyle = '#ffffff';
    }
    ectx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Redraw frame
  if (state.frame === 'ornate') drawOrnateFrame(ectx, CANVAS_W, CANVAS_H, state.color);
  else if (state.frame === 'geometric') drawGeometricFrame(ectx, CANVAS_W, CANVAS_H, state.color);
  else if (state.frame === 'floral') drawFloralFrame(ectx, CANVAS_W, CANVAS_H, state.color);
  else if (state.frame === 'oval') drawOvalFrame(ectx, CANVAS_W, CANVAS_H, state.color);
  else if (state.frame === 'diamond') drawDiamondFrame(ectx, CANVAS_W, CANVAS_H, state.color);

  const fontStr = `${state.fontWeight} ${state.fontSize}px '${state.font}', serif`;
  ectx.font = fontStr;
  ectx.fillStyle = state.color;
  ectx.textAlign = 'center';
  ectx.textBaseline = 'middle';
  ectx.direction = 'rtl';
  ectx.fillText(state.text || '...', CANVAS_W / 2, CANVAS_H / 2);

  const link = document.createElement('a');
  const safeName = (state.text || 'calligraphy').replace(/\s+/g, '_');
  link.download = `مخطوط_${safeName}.png`;
  link.href = exportCanvas.toDataURL('image/png');
  link.click();

  showToast(transparent ? 'تم التحميل بخلفية شفافة ✓' : 'تم التحميل بنجاح ✓');
}

// ── Gallery ─────────────────────────────────────────────
const galleryItems = [
  { text: 'بسم الله', font: 'Amiri', color: '#8B6914', frame: 'ornate', size: 90 },
  { text: 'محمد', font: 'Scheherazade New', color: '#1B4332', frame: 'floral', size: 110 },
  { text: 'الله أكبر', font: 'Lateef', color: '#1d3557', frame: 'geometric', size: 85 },
  { text: 'نور', font: 'Amiri', color: '#6B2737', frame: 'oval', size: 130 },
  { text: 'فاطمة', font: 'Reem Kufi', color: '#5c2d91', frame: 'diamond', size: 100 },
  { text: 'الحمد لله', font: 'Noto Naskh Arabic', color: '#8B6914', frame: 'ornate', size: 80 },
  { text: 'سارة', font: 'Lateef', color: '#1B4332', frame: 'none', size: 130 },
  { text: 'عمر', font: 'Noto Kufi Arabic', color: '#1a1a2e', frame: 'geometric', size: 120 },
];

function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  galleryItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    const c = document.createElement('canvas');
    c.width = 300;
    c.height = 300;
    const gctx = c.getContext('2d');

    // parchment bg
    gctx.fillStyle = '#1a1a35';
    gctx.fillRect(0, 0, 300, 300);

    // frame
    if (item.frame === 'ornate') drawOrnateFrame(gctx, 300, 300, item.color);
    else if (item.frame === 'geometric') drawGeometricFrame(gctx, 300, 300, item.color);
    else if (item.frame === 'floral') drawFloralFrame(gctx, 300, 300, item.color);
    else if (item.frame === 'oval') drawOvalFrame(gctx, 300, 300, item.color);
    else if (item.frame === 'diamond') drawDiamondFrame(gctx, 300, 300, item.color);

    gctx.font = `700 ${item.size}px '${item.font}', serif`;
    gctx.fillStyle = item.color;
    gctx.textAlign = 'center';
    gctx.textBaseline = 'middle';
    gctx.direction = 'rtl';
    gctx.fillText(item.text, 150, 150);

    div.appendChild(c);
    div.title = item.text;
    div.addEventListener('click', () => {
      state.text = item.text;
      state.font = item.font;
      state.color = item.color;
      state.frame = item.frame;
      state.fontSize = item.size;
      syncUI();
      render();
      document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
      showToast('تم تحميل التصميم في المحرر');
    });

    grid.appendChild(div);
  });
}

// ── Occasions ───────────────────────────────────────────
const occasionData = {
  wedding:    { text: 'بالرفاء والبنين', font: 'Amiri', color: '#8B6914', frame: 'ornate', size: 90 },
  newborn:    { text: 'مبارك المولود', font: 'Scheherazade New', color: '#1B4332', frame: 'floral', size: 95 },
  eid:        { text: 'كل عام وأنتم بخير', font: 'Amiri', color: '#8B6914', frame: 'geometric', size: 80 },
  graduation: { text: 'ألف مبروك التخرج', font: 'Reem Kufi', color: '#5c2d91', frame: 'diamond', size: 82 },
  ramadan:    { text: 'رمضان كريم', font: 'Lateef', color: '#6B2737', frame: 'oval', size: 105 },
  quran:      { text: 'بسم الله الرحمن الرحيم', font: 'Amiri', color: '#1B4332', frame: 'ornate', size: 70 },
};

window.loadOccasion = function (key) {
  const d = occasionData[key];
  if (!d) return;
  Object.assign(state, d);
  syncUI();
  render();
  document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
  showToast('تم تحميل تصميم المناسبة');
};

// ── Sync UI to State ─────────────────────────────────────
function syncUI() {
  document.getElementById('nameInput').value = state.text;
  document.getElementById('fontSize').value = state.fontSize;
  document.getElementById('sizeLabel').textContent = state.fontSize;

  document.querySelectorAll('.font-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.font === state.font);
  });

  document.querySelectorAll('.color-btn:not(.custom-color-btn)').forEach(b => {
    b.classList.toggle('active', b.dataset.color === state.color);
  });

  document.querySelectorAll('.frame-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.frame === state.frame);
  });

  document.querySelectorAll('.bg-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.bg === state.bgPreview);
  });
}

// ── Toast ───────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// ── Event Listeners ─────────────────────────────────────
function initEvents() {
  // Text input
  document.getElementById('nameInput').addEventListener('input', e => {
    state.text = e.target.value;
    render();
  });

  // Font buttons
  document.getElementById('fontGrid').addEventListener('click', e => {
    const btn = e.target.closest('.font-btn');
    if (!btn) return;
    document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.font = btn.dataset.font;
    state.fontWeight = btn.dataset.weight;
    render();
  });

  // Color palette
  document.getElementById('colorPalette').addEventListener('click', e => {
    const btn = e.target.closest('.color-btn');
    if (!btn) return;
    if (btn.classList.contains('custom-color-btn')) {
      document.getElementById('customColor').click();
      return;
    }
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.color = btn.dataset.color;
    render();
  });

  document.getElementById('customColor').addEventListener('input', e => {
    state.color = e.target.value;
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    const customBtn = document.querySelector('.custom-color-btn');
    customBtn.style.background = state.color;
    customBtn.classList.add('active');
    render();
  });

  // Font size
  document.getElementById('fontSize').addEventListener('input', e => {
    state.fontSize = parseInt(e.target.value);
    document.getElementById('sizeLabel').textContent = state.fontSize;
    render();
  });

  // Frame
  document.getElementById('frameGrid').addEventListener('click', e => {
    const btn = e.target.closest('.frame-btn');
    if (!btn) return;
    document.querySelectorAll('.frame-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.frame = btn.dataset.frame;
    render();
  });

  // Background
  document.querySelectorAll('.bg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.bgPreview = btn.dataset.bg;
      // Update wrapper background to match
      const wrapper = document.getElementById('previewWrapper');
      if (state.bgPreview === 'white') wrapper.style.background = '#ffffff';
      else if (state.bgPreview === 'dark') wrapper.style.background = '#0d0d1a';
      else if (state.bgPreview === 'parchment') wrapper.style.background = '#f5e6c8';
      else wrapper.style.background = '';
      render();
    });
  });

  // Downloads
  document.getElementById('downloadPNG').addEventListener('click', () => downloadCanvas(true));
  document.getElementById('downloadPNGbg').addEventListener('click', () => downloadCanvas(false));

  // Nav active highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
}

// ── Init ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Wait for fonts
  document.fonts.ready.then(() => {
    render();
    buildGallery();
  });
  initEvents();
});

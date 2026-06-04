// ==========================================================================
//  مخطوط — Admin Dashboard Controller (vanilla JS)
// ==========================================================================

const MK = {
  settings: 'mk_settings',
  gallery: 'mk_gallery',
  occasions: 'mk_occasions',
  pass: 'mk_admin_pass'
};

const DEF_SETTINGS = {
  siteTitle: 'مخطوط',
  siteSub: 'الخط العربي',
  heroTitle: 'اكتب اسمك بأجمل الخطوط العربية',
  heroDesc: 'حوّل اسمك أو أي نص إلى لوحة فنية بخطوط عربية أصيلة، وحمّلها بخلفية شفافة',
  footerDesc: 'حافظ على جمال الخط العربي'
};

const DEF_GALLERY = [
  { id: 1, text: 'بسم الله', font: 'Amiri', color: '#8B6914', frame: 'ornate', size: 90 },
  { id: 2, text: 'محمد', font: 'Scheherazade New', color: '#1B4332', frame: 'floral', size: 110 },
  { id: 3, text: 'الله أكبر', font: 'Lateef', color: '#1d3557', frame: 'geometric', size: 85 },
  { id: 4, text: 'نور', font: 'Amiri', color: '#6B2737', frame: 'oval', size: 130 },
  { id: 5, text: 'فاطمة', font: 'Reem Kufi', color: '#5c2d91', frame: 'diamond', size: 100 },
  { id: 6, text: 'الحمد لله', font: 'Noto Naskh Arabic', color: '#8B6914', frame: 'ornate', size: 80 },
  { id: 7, text: 'سارة', font: 'Lateef', color: '#1B4332', frame: 'none', size: 130 },
  { id: 8, text: 'عمر', font: 'Noto Kufi Arabic', color: '#1a1a2e', frame: 'geometric', size: 120 }
];

const DEF_OCCASIONS = [
  { id: 'wedding', name: 'حفل زفاف', icon: '💍', text: 'بالرفاء والبنين', font: 'Amiri', color: '#8B6914', frame: 'ornate', size: 90 },
  { id: 'newborn', name: 'مولود جديد', icon: '👶', text: 'مبارك المولود', font: 'Scheherazade New', color: '#1B4332', frame: 'floral', size: 95 },
  { id: 'eid', name: 'عيد مبارك', icon: '🌙', text: 'كل عام وأنتم بخير', font: 'Amiri', color: '#8B6914', frame: 'geometric', size: 80 },
  { id: 'graduation', name: 'تخرج', icon: '🎓', text: 'ألف مبروك التخرج', font: 'Reem Kufi', color: '#5c2d91', frame: 'diamond', size: 82 },
  { id: 'ramadan', name: 'رمضان', icon: '✨', text: 'رمضان كريم', font: 'Lateef', color: '#6B2737', frame: 'oval', size: 105 },
  { id: 'quran', name: 'آيات قرآنية', icon: '📖', text: 'بسم الله الرحمن الرحيم', font: 'Amiri', color: '#1B4332', frame: 'ornate', size: 70 }
];

function getData(k, def) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : structuredClone(def);
  } catch (e) {
    return structuredClone(def);
  }
}
function saveData(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

// ---- label maps ----------------------------------------------------------
const FONT_LABELS = {
  'Amiri': 'أميري',
  'Scheherazade New': 'شهرزاد',
  'Lateef': 'لطيف',
  'Reem Kufi': 'ريم كوفي',
  'Noto Naskh Arabic': 'نسخ',
  'Noto Kufi Arabic': 'كوفي'
};
const FRAME_LABELS = {
  'none': 'بلا إطار',
  'ornate': 'زخرفي',
  'geometric': 'هندسي',
  'floral': 'زهري',
  'oval': 'بيضاوي',
  'diamond': 'معين'
};

// ---- editing state -------------------------------------------------------
let editingGalleryId = null;

// ==========================================================================
//  Canvas helpers — frame drawing
// ==========================================================================
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawDiamond(ctx, cx, cy, size) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size, cy);
  ctx.closePath();
}

function drawFlowerDot(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawCornerFlower(ctx, cx, cy, color) {
  ctx.fillStyle = color;
  const petals = 6;
  const pr = 5;
  const dist = 7;
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2;
    const px = cx + Math.cos(a) * dist;
    const py = cy + Math.sin(a) * dist;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, pr, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrnateFrame(ctx, w, h, color) {
  const m = Math.max(16, w * 0.05);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  roundRect(ctx, m, m, w - 2 * m, h - 2 * m, 18);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  roundRect(ctx, m + 7, m + 7, w - 2 * (m + 7), h - 2 * (m + 7), 12);
  ctx.stroke();
  // corner flowers
  drawCornerFlower(ctx, m, m, color);
  drawCornerFlower(ctx, w - m, m, color);
  drawCornerFlower(ctx, m, h - m, color);
  drawCornerFlower(ctx, w - m, h - m, color);
  // diamonds at midpoints
  ctx.fillStyle = color;
  drawDiamond(ctx, w / 2, m, 6); ctx.fill();
  drawDiamond(ctx, w / 2, h - m, 6); ctx.fill();
  drawDiamond(ctx, m, h / 2, 6); ctx.fill();
  drawDiamond(ctx, w - m, h / 2, 6); ctx.fill();
}

function drawGeometricFrame(ctx, w, h, color) {
  const m = Math.max(16, w * 0.05);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(m, m, w - 2 * m, h - 2 * m);
  // corner cuts
  const c = 14;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(m, m + c); ctx.lineTo(m + c, m);
  ctx.moveTo(w - m - c, m); ctx.lineTo(w - m, m + c);
  ctx.moveTo(w - m, h - m - c); ctx.lineTo(w - m - c, h - m);
  ctx.moveTo(m + c, h - m); ctx.lineTo(m, h - m - c);
  ctx.stroke();
  // dashed inner rect
  ctx.save();
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(m + 9, m + 9, w - 2 * (m + 9), h - 2 * (m + 9));
  ctx.restore();
}

function drawFloralFrame(ctx, w, h, color) {
  const m = Math.max(16, w * 0.05);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  roundRect(ctx, m, m, w - 2 * m, h - 2 * m, 16);
  ctx.stroke();
  // dots along edges
  const steps = 8;
  const x0 = m, y0 = m, x1 = w - m, y1 = h - m;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    drawFlowerDot(ctx, x0 + (x1 - x0) * t, y0, 3, color);
    drawFlowerDot(ctx, x0 + (x1 - x0) * t, y1, 3, color);
    drawFlowerDot(ctx, x0, y0 + (y1 - y0) * t, 3, color);
    drawFlowerDot(ctx, x1, y0 + (y1 - y0) * t, 3, color);
  }
}

function drawOvalFrame(ctx, w, h, color) {
  const m = Math.max(16, w * 0.05);
  const cx = w / 2, cy = h / 2;
  const rx = (w - 2 * m) / 2, ry = (h - 2 * m) / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx - 7, ry - 7, 0, 0, Math.PI * 2);
  ctx.stroke();
  // dots around the oval
  const dots = 16;
  for (let i = 0; i < dots; i++) {
    const a = (i / dots) * Math.PI * 2;
    drawFlowerDot(ctx, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 2.5, color);
  }
}

function drawDiamondFrame(ctx, w, h, color) {
  const m = Math.max(16, w * 0.05);
  const cx = w / 2, cy = h / 2;
  const rx = (w - 2 * m) / 2, ry = (h - 2 * m) / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry);
  ctx.lineTo(cx + rx, cy);
  ctx.lineTo(cx, cy + ry);
  ctx.lineTo(cx - rx, cy);
  ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry + 9);
  ctx.lineTo(cx + rx - 9, cy);
  ctx.lineTo(cx, cy + ry - 9);
  ctx.lineTo(cx - rx + 9, cy);
  ctx.closePath();
  ctx.stroke();
  // corner diamonds at vertices
  ctx.fillStyle = color;
  drawDiamond(ctx, cx, cy - ry, 5); ctx.fill();
  drawDiamond(ctx, cx + rx, cy, 5); ctx.fill();
  drawDiamond(ctx, cx, cy + ry, 5); ctx.fill();
  drawDiamond(ctx, cx - rx, cy, 5); ctx.fill();
}

function drawFrame(ctx, frame, w, h, color) {
  switch (frame) {
    case 'ornate': drawOrnateFrame(ctx, w, h, color); break;
    case 'geometric': drawGeometricFrame(ctx, w, h, color); break;
    case 'floral': drawFloralFrame(ctx, w, h, color); break;
    case 'oval': drawOvalFrame(ctx, w, h, color); break;
    case 'diamond': drawDiamondFrame(ctx, w, h, color); break;
    case 'none':
    default: break;
  }
}

// ==========================================================================
//  Render a single calligraphy item onto a canvas
// ==========================================================================
function renderItemCanvas(canvas, item, bg) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = bg || '#1a1a35';
  ctx.fillRect(0, 0, w, h);
  drawFrame(ctx, item.frame, w, h, item.color);
  ctx.save();
  ctx.font = `700 ${item.size}px '${item.font}', serif`;
  ctx.fillStyle = item.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if ('direction' in ctx) ctx.direction = 'rtl';
  ctx.fillText(item.text, w / 2, h / 2);
  ctx.restore();
}

// ==========================================================================
//  Login system
// ==========================================================================
function getPass() {
  return localStorage.getItem(MK.pass) || 'admin';
}

function doLogin() {
  const input = document.getElementById('passInput');
  const err = document.getElementById('loginError');
  if (input.value === getPass()) {
    sessionStorage.setItem('mk_session', '1');
    if (err) err.textContent = '';
    showApp();
  } else {
    if (err) err.textContent = 'كلمة المرور غير صحيحة';
  }
}

function showApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminApp').style.display = '';
  loadGalleryTable();
  loadOccasionsEditor();
  loadSettings();
  updateStats();
  showPanel('dashboard');
}

function showLogin() {
  document.getElementById('adminApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = '';
  const input = document.getElementById('passInput');
  if (input) input.value = '';
}

// ==========================================================================
//  Panel navigation
// ==========================================================================
const PANEL_TITLES = {
  dashboard: 'الرئيسية',
  gallery: 'إدارة المعرض',
  occasions: 'إدارة المناسبات',
  settings: 'إعدادات الموقع',
  security: 'الأمان'
};

function showPanel(id) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  document.querySelectorAll('.snav-item').forEach(n => {
    n.classList.toggle('active', n.getAttribute('data-panel') === id);
  });
  const title = document.getElementById('adminPageTitle');
  if (title) title.textContent = PANEL_TITLES[id] || '';
  // close mobile sidebar after navigation
  document.querySelector('.admin-app')?.classList.remove('sidebar-open');
}
window.showPanel = showPanel;

// ==========================================================================
//  Gallery CRUD
// ==========================================================================
function loadGalleryTable() {
  const tbody = document.getElementById('galleryTbody');
  if (!tbody) return;
  const gallery = getData(MK.gallery, DEF_GALLERY);
  tbody.innerHTML = '';
  gallery.forEach(item => {
    const tr = document.createElement('tr');

    const tdPrev = document.createElement('td');
    const canvas = document.createElement('canvas');
    canvas.width = 70; canvas.height = 70;
    canvas.className = 'mini-canvas';
    const scaled = Object.assign({}, item, { size: Math.min(item.size * 0.5, 40) });
    tdPrev.appendChild(canvas);
    tr.appendChild(tdPrev);
    renderItemCanvas(canvas, scaled, '#1a1a35');

    const tdText = document.createElement('td');
    tdText.textContent = item.text;
    tr.appendChild(tdText);

    const tdFont = document.createElement('td');
    tdFont.textContent = FONT_LABELS[item.font] || item.font;
    tr.appendChild(tdFont);

    const tdFrame = document.createElement('td');
    tdFrame.textContent = FRAME_LABELS[item.frame] || item.frame;
    tr.appendChild(tdFrame);

    const tdSize = document.createElement('td');
    tdSize.textContent = item.size;
    tr.appendChild(tdSize);

    const tdActions = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'تعديل';
    editBtn.addEventListener('click', () => editGalleryItem(item.id));
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-delete';
    delBtn.textContent = 'حذف';
    delBtn.addEventListener('click', () => deleteGalleryItem(item.id));
    tdActions.appendChild(editBtn);
    tdActions.appendChild(delBtn);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

function readGalleryForm() {
  return {
    text: document.getElementById('gfText').value.trim(),
    font: document.getElementById('gfFont').value,
    color: document.getElementById('gfColor').value,
    frame: document.getElementById('gfFrame').value,
    size: parseInt(document.getElementById('gfSize').value, 10)
  };
}

function updateGalleryPreview() {
  const item = readGalleryForm();
  if (!item.text) item.text = 'معاينة';
  const label = document.getElementById('gfSizeLabel');
  if (label) label.textContent = item.size + 'px';
  renderItemCanvas(document.getElementById('gfCanvas'), item, '#1a1a35');
}

function openGalleryForm() {
  document.getElementById('galleryForm').style.display = '';
}
function hideGalleryForm() {
  document.getElementById('galleryForm').style.display = 'none';
}

function addGalleryItem() {
  editingGalleryId = null;
  document.getElementById('gfText').value = '';
  document.getElementById('gfFont').value = 'Amiri';
  document.getElementById('gfColor').value = '#8B6914';
  document.getElementById('gfFrame').value = 'ornate';
  document.getElementById('gfSize').value = '90';
  document.getElementById('formTitle').textContent = 'إضافة عمل جديد';
  openGalleryForm();
  updateGalleryPreview();
}

function editGalleryItem(id) {
  const gallery = getData(MK.gallery, DEF_GALLERY);
  const item = gallery.find(g => g.id === id);
  if (!item) return;
  editingGalleryId = id;
  document.getElementById('gfText').value = item.text;
  document.getElementById('gfFont').value = item.font;
  document.getElementById('gfColor').value = item.color;
  document.getElementById('gfFrame').value = item.frame;
  document.getElementById('gfSize').value = item.size;
  document.getElementById('formTitle').textContent = 'تعديل العمل';
  openGalleryForm();
  updateGalleryPreview();
  document.getElementById('galleryForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveGalleryItem() {
  const data = readGalleryForm();
  if (!data.text) {
    showAdminToast('الرجاء إدخال النص', 'error');
    return;
  }
  const gallery = getData(MK.gallery, DEF_GALLERY);
  if (editingGalleryId !== null) {
    const idx = gallery.findIndex(g => g.id === editingGalleryId);
    if (idx > -1) gallery[idx] = Object.assign({}, gallery[idx], data);
  } else {
    gallery.push(Object.assign({ id: Date.now() }, data));
  }
  saveData(MK.gallery, gallery);
  loadGalleryTable();
  updateStats();
  hideGalleryForm();
  editingGalleryId = null;
  showAdminToast('تم الحفظ');
}

function deleteGalleryItem(id) {
  if (!confirm('حذف هذا العمل؟')) return;
  let gallery = getData(MK.gallery, DEF_GALLERY);
  gallery = gallery.filter(g => g.id !== id);
  saveData(MK.gallery, gallery);
  loadGalleryTable();
  updateStats();
  showAdminToast('تم الحذف');
}

// ==========================================================================
//  Occasions editor
// ==========================================================================
const ALL_FONTS = ['Amiri', 'Scheherazade New', 'Lateef', 'Reem Kufi', 'Noto Naskh Arabic', 'Noto Kufi Arabic'];
const ALL_FRAMES = ['none', 'ornate', 'geometric', 'floral', 'oval', 'diamond'];

function buildFontOptions(selected) {
  return ALL_FONTS.map(f => `<option value="${f}" ${f === selected ? 'selected' : ''}>${FONT_LABELS[f]}</option>`).join('');
}
function buildFrameOptions(selected) {
  return ALL_FRAMES.map(f => `<option value="${f}" ${f === selected ? 'selected' : ''}>${FRAME_LABELS[f]}</option>`).join('');
}

function loadOccasionsEditor() {
  const container = document.getElementById('occasionsEditor');
  if (!container) return;
  const occasions = getData(MK.occasions, DEF_OCCASIONS);
  container.innerHTML = '';
  occasions.forEach(occ => {
    const card = document.createElement('div');
    card.className = 'occasion-card';
    card.innerHTML = `
      <canvas class="occ-canvas" width="140" height="140"></canvas>
      <div class="occ-fields">
        <label>الأيقونة <input type="text" class="occ-icon" value="${occ.icon}" /></label>
        <label>الاسم <input type="text" class="occ-name" value="${occ.name}" /></label>
        <label>النص <input type="text" class="occ-text" value="${occ.text}" /></label>
        <label>الخط <select class="occ-font">${buildFontOptions(occ.font)}</select></label>
        <label>اللون <input type="color" class="occ-color" value="${occ.color}" /></label>
        <label>الإطار <select class="occ-frame">${buildFrameOptions(occ.frame)}</select></label>
        <label>الحجم <input type="range" class="occ-size" min="40" max="200" value="${occ.size}" /> <span class="occ-size-label">${occ.size}px</span></label>
        <button class="btn-save occ-save">حفظ</button>
      </div>`;
    container.appendChild(card);

    const canvas = card.querySelector('.occ-canvas');
    const getCardItem = () => ({
      text: card.querySelector('.occ-text').value || 'معاينة',
      font: card.querySelector('.occ-font').value,
      color: card.querySelector('.occ-color').value,
      frame: card.querySelector('.occ-frame').value,
      size: Math.min(parseInt(card.querySelector('.occ-size').value, 10), 60)
    });
    const refresh = () => {
      card.querySelector('.occ-size-label').textContent = card.querySelector('.occ-size').value + 'px';
      renderItemCanvas(canvas, getCardItem(), '#1a1a35');
    };
    card.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', refresh);
    });
    refresh();

    card.querySelector('.occ-save').addEventListener('click', () => {
      const arr = getData(MK.occasions, DEF_OCCASIONS);
      const idx = arr.findIndex(o => o.id === occ.id);
      if (idx > -1) {
        arr[idx] = Object.assign({}, arr[idx], {
          icon: card.querySelector('.occ-icon').value,
          name: card.querySelector('.occ-name').value,
          text: card.querySelector('.occ-text').value,
          font: card.querySelector('.occ-font').value,
          color: card.querySelector('.occ-color').value,
          frame: card.querySelector('.occ-frame').value,
          size: parseInt(card.querySelector('.occ-size').value, 10)
        });
        saveData(MK.occasions, arr);
        showAdminToast('تم حفظ المناسبة');
      }
    });
  });
}

// ==========================================================================
//  Settings
// ==========================================================================
function loadSettings() {
  const s = getData(MK.settings, DEF_SETTINGS);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('sfTitle', s.siteTitle);
  set('sfSub', s.siteSub);
  set('sfHeroTitle', s.heroTitle);
  set('sfHeroDesc', s.heroDesc);
  set('sfFooterDesc', s.footerDesc);
}

function saveSettings() {
  const s = {
    siteTitle: document.getElementById('sfTitle').value,
    siteSub: document.getElementById('sfSub').value,
    heroTitle: document.getElementById('sfHeroTitle').value,
    heroDesc: document.getElementById('sfHeroDesc').value,
    footerDesc: document.getElementById('sfFooterDesc').value
  };
  saveData(MK.settings, s);
  showAdminToast('تم حفظ الإعدادات');
}

// ==========================================================================
//  Security — change password
// ==========================================================================
function changePassword() {
  const cur = getPass();
  const oldV = document.getElementById('oldPass').value;
  const newV = document.getElementById('newPass').value;
  const confV = document.getElementById('confirmPass').value;
  const msg = document.getElementById('passMsg');
  const setMsg = (t, err) => {
    if (!msg) return;
    msg.textContent = t;
    msg.classList.toggle('error', !!err);
  };
  if (oldV !== cur) {
    setMsg('كلمة المرور الحالية غير صحيحة', true);
    return;
  }
  if (newV.length < 3) {
    setMsg('كلمة المرور الجديدة قصيرة جداً (3 أحرف على الأقل)', true);
    return;
  }
  if (newV !== confV) {
    setMsg('كلمتا المرور غير متطابقتين', true);
    return;
  }
  localStorage.setItem(MK.pass, newV);
  document.getElementById('oldPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';
  setMsg('تم تغيير كلمة المرور بنجاح', false);
  showAdminToast('تم تغيير كلمة المرور');
}

// ==========================================================================
//  Dashboard stats
// ==========================================================================
function updateStats() {
  const gallery = getData(MK.gallery, DEF_GALLERY);
  const occasions = getData(MK.occasions, DEF_OCCASIONS);
  const sg = document.getElementById('statGallery');
  const so = document.getElementById('statOccasions');
  if (sg) sg.textContent = gallery.length;
  if (so) so.textContent = occasions.length;
}

// ==========================================================================
//  Reset all data
// ==========================================================================
function resetAllData() {
  if (!confirm('إعادة تعيين جميع البيانات للوضع الافتراضي؟')) return;
  localStorage.removeItem(MK.settings);
  localStorage.removeItem(MK.gallery);
  localStorage.removeItem(MK.occasions);
  location.reload();
}
window.resetAllData = resetAllData;

// ==========================================================================
//  Toast
// ==========================================================================
let toastTimer = null;
function showAdminToast(msg, type) {
  const t = document.getElementById('adminToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.toggle('error', type === 'error');
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ==========================================================================
//  Init
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // login
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) loginBtn.addEventListener('click', doLogin);
  const passInput = document.getElementById('passInput');
  if (passInput) passInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  // logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('mk_session');
    showLogin();
  });

  // sidebar nav
  document.querySelectorAll('.snav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      showPanel(item.getAttribute('data-panel'));
    });
  });

  // sidebar toggle (mobile)
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) sidebarToggle.addEventListener('click', () => {
    document.querySelector('.admin-app')?.classList.toggle('sidebar-open');
  });

  // gallery
  document.getElementById('addGalleryBtn')?.addEventListener('click', addGalleryItem);
  document.getElementById('saveGalleryBtn')?.addEventListener('click', saveGalleryItem);
  document.getElementById('cancelGalleryBtn')?.addEventListener('click', hideGalleryForm);
  ['gfText', 'gfFont', 'gfColor', 'gfFrame', 'gfSize'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateGalleryPreview);
  });

  // settings
  document.getElementById('saveSettingsBtn')?.addEventListener('click', saveSettings);

  // security
  document.getElementById('changePassBtn')?.addEventListener('click', changePassword);

  // login check
  if (sessionStorage.getItem('mk_session') === '1') {
    showApp();
  } else {
    showLogin();
  }
});

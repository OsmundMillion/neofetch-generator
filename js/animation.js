const STEP_INTERVAL = 28;
const DEFAULT_NAME = 'OSMUND';
const DEFAULT_TAGLINE = '[ Passionate Developer ]';
const DEFAULT_COLOR = '#00ff41';

let currentRows = [];
let currentSubtitle = '';
let currentColor = DEFAULT_COLOR;
let col = 0;
let timer = null;
let isRunning = false;

/* ── Validation ── */

function showError(msg) {
  const errorEl = document.getElementById('input-error');
  if (!errorEl) return;
  errorEl.textContent = msg;
  errorEl.classList.add('show');
  setTimeout(() => errorEl.classList.remove('show'), 3500);
}

function clearError() {
  const errorEl = document.getElementById('input-error');
  if (!errorEl) return;
  errorEl.textContent = '';
  errorEl.classList.remove('show');
}

function validateName(name) {
  if (!name || name.trim() === '') {
    return { valid: false, error: '⚠ name cannot be empty.' };
  }
  const invalid = name.toUpperCase().split('').filter(c => c !== ' ' && !FONT[c]);
  if (invalid.length > 0) {
    const unique = [...new Set(invalid)].join(', ');
    return { valid: false, error: `⚠ unsupported: "${unique}" — letters only.` };
  }
  return { valid: true, error: null };
}

/* ── Color ── */

function setColor(color) {
  currentColor = color;
  const artEl = document.getElementById('ascii-art');
  const cursorEl = document.getElementById('cursor');
  const subtitleEl = document.getElementById('subtitle');
  const replayBtn = document.getElementById('replay-btn');
  const presetBtns = document.querySelectorAll('.color-preset');

  if (artEl) {
    artEl.style.color = color;
    artEl.style.textShadow = `0 0 6px ${color}88`;
  }
  if (cursorEl) {
    cursorEl.style.background = color;
    cursorEl.style.boxShadow = `0 0 5px ${color}`;
  }
  if (subtitleEl) {
    subtitleEl.style.color = color;
    subtitleEl.style.textShadow = `0 0 8px ${color}66`;
  }
  if (replayBtn) {
    replayBtn.style.color = color;
    replayBtn.style.borderColor = color;
  }

  presetBtns.forEach(btn => {
    btn.style.outline = btn.dataset.color === color
      ? `2px solid ${color}`
      : 'none';
  });
}

/* ── Animation engine ── */

function renderFrame(c) {
  const artEl = document.getElementById('ascii-art');
  if (!artEl) return;
  artEl.textContent = currentRows.map(r => r.substring(0, c)).join('\n');
}

function step() {
  col++;
  renderFrame(col);
  const maxLen = Math.max(...currentRows.map(r => r.length));
  if (col < maxLen) {
    timer = setTimeout(step, STEP_INTERVAL);
  } else {
    finishAnimation();
  }
}

function finishAnimation() {
  isRunning = false;
  const cursorEl = document.getElementById('cursor');
  const subtitleEl = document.getElementById('subtitle');
  const replayBtn = document.getElementById('replay-btn');

  if (cursorEl) cursorEl.style.display = 'none';

  setTimeout(() => {
    if (subtitleEl) {
      subtitleEl.textContent = currentSubtitle;
      subtitleEl.classList.add('show');
    }
    setTimeout(() => {
      if (replayBtn) replayBtn.classList.add('show');
    }, 800);
  }, 300);
}

function resetAnimation() {
  clearTimeout(timer);
  col = 0;
  isRunning = false;

  const subtitleEl = document.getElementById('subtitle');
  const replayBtn = document.getElementById('replay-btn');
  const cursorEl = document.getElementById('cursor');

  if (subtitleEl) subtitleEl.classList.remove('show');
  if (replayBtn) replayBtn.classList.remove('show');
  if (cursorEl) cursorEl.style.display = 'inline-block';

  renderFrame(0);
}

function startAnimation(rows, subtitle, fontSize) {
  currentRows = rows;
  currentSubtitle = subtitle;

  const artEl = document.getElementById('ascii-art');
  const titleLabel = document.getElementById('title-label');
  const nameInput = document.getElementById('name-input');

  if (artEl) artEl.style.fontSize = fontSize + 'px';
  if (titleLabel && nameInput) {
    const slug = nameInput.value.trim().toLowerCase().replace(/\s+/g, '-') || 'user';
    titleLabel.textContent = `${slug}@github ~ neofetch`;
  }

  resetAnimation();
  isRunning = true;
  timer = setTimeout(step, STEP_INTERVAL);
}

/* ── Generate & Clear ── */

function handleGenerate() {
  const nameInput = document.getElementById('name-input');
  const taglineInput = document.getElementById('tagline-input');

  const name = nameInput.value.trim();
  const tagline = taglineInput.value.trim() || DEFAULT_TAGLINE;

  const { valid, error } = validateName(name);
  if (!valid) {
    showError(error);
    nameInput.focus();
    return;
  }

  clearError();
  const rows = renderName(name);
  const fontSize = getFontSize(name);
  startAnimation(rows, tagline, fontSize);
  setColor(currentColor);
}

function handleClear() {
  const nameInput = document.getElementById('name-input');
  const taglineInput = document.getElementById('tagline-input');
  const customColor = document.getElementById('custom-color');
  const charHint = document.getElementById('char-hint');

  nameInput.value = '';
  taglineInput.value = '';
  charHint.textContent = '0 / 10';
  charHint.style.color = '#666';
  if (customColor) customColor.value = DEFAULT_COLOR;

  clearError();
  setColor(DEFAULT_COLOR);

  const rows = renderName(DEFAULT_NAME);
  const fontSize = getFontSize(DEFAULT_NAME);
  currentSubtitle = DEFAULT_TAGLINE;
  startAnimation(rows, DEFAULT_TAGLINE, fontSize);

  const titleLabel = document.getElementById('title-label');
  if (titleLabel) titleLabel.textContent = 'osmund@github ~ neofetch';
}

/* ── Init ── */

function initControls() {
  const generateBtn = document.getElementById('generate-btn');
  const clearBtn = document.getElementById('clear-btn');
  const replayBtn = document.getElementById('replay-btn');
  const presetBtns = document.querySelectorAll('.color-preset');
  const customColor = document.getElementById('custom-color');
  const nameInput = document.getElementById('name-input');
  const charHint = document.getElementById('char-hint');

  generateBtn.addEventListener('click', handleGenerate);

  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  if (copyBtn) copyBtn.addEventListener('click', handleCopy);
  if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
  clearBtn.addEventListener('click', handleClear);

  replayBtn.addEventListener('click', () => {
    resetAnimation();
    isRunning = true;
    timer = setTimeout(step, STEP_INTERVAL);
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setColor(btn.dataset.color);
      if (customColor) customColor.value = btn.dataset.color;
    });
  });

  if (customColor) {
    customColor.addEventListener('input', (e) => {
      setColor(e.target.value);
      presetBtns.forEach(btn => btn.style.outline = 'none');
    });
  }

  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleGenerate();
  });

  nameInput.addEventListener('input', () => {
    const len = nameInput.value.length;
    charHint.textContent = `${len} / 10`;
    charHint.style.color = len >= 9 ? '#ff4f4f' : '#666';
    if (len === 0) clearError();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initControls();
  setColor(DEFAULT_COLOR);

  const rows = renderName(DEFAULT_NAME);
  const fontSize = getFontSize(DEFAULT_NAME);
  startAnimation(rows, DEFAULT_TAGLINE, fontSize);
});

/* ── Copy ASCII ── */

function handleCopy() {
  const artEl = document.getElementById('ascii-art');
  const subtitleEl = document.getElementById('subtitle');
  const copyBtn = document.getElementById('copy-btn');
  if (!artEl) return;

  const subtitleText = subtitleEl ? '\n' + subtitleEl.textContent : '';
  const fullText = artEl.textContent + subtitleText;

  navigator.clipboard.writeText(fullText).then(() => {
    if (!copyBtn) return;
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓ copied';
    copyBtn.classList.add('success');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('success');
    }, 2000);
  }).catch(() => {
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.textContent = '✕ failed';
      setTimeout(() => { copyBtn.textContent = '⎘ copy'; }, 2000);
    }
  });
}

/* ── Download as PNG ── */

function handleDownload() {
  const terminalEl = document.querySelector('.terminal');
  const downloadBtn = document.getElementById('download-btn');
  if (!terminalEl || typeof html2canvas === 'undefined') return;

  const original = downloadBtn.textContent;
  downloadBtn.textContent = '... saving';

  html2canvas(terminalEl, {
    backgroundColor: '#0d0d0d',
    scale: 2,
    useCORS: true,
    logging: false,
  }).then(canvas => {
    const link = document.createElement('a');
    const nameInput = document.getElementById('name-input');
    const slug = nameInput ? nameInput.value.trim().toLowerCase() || 'neofetch' : 'neofetch';
    link.download = `${slug}-neofetch.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    downloadBtn.textContent = '✓ saved';
    downloadBtn.classList.add('success');
    setTimeout(() => {
      downloadBtn.textContent = original;
      downloadBtn.classList.remove('success');
    }, 2000);
  }).catch(() => {
    downloadBtn.textContent = '✕ failed';
    setTimeout(() => { downloadBtn.textContent = original; }, 2000);
  });
}
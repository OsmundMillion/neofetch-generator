const FONT_ROWS = 6;
const MAX_CHARS = 10;
const BASE_FONT_SIZE = 11;
const MIN_FONT_SIZE = 6;

function renderName(name) {
  const chars = name.toUpperCase().slice(0, MAX_CHARS).split('');

  const validChars = chars.map(c => FONT[c] ? c : ' ');

  const rows = [];
  for (let r = 0; r < FONT_ROWS; r++) {
    rows.push(validChars.map(c => FONT[c][r]).join(''));
  }

  return rows;
}

function getFontSize(name) {
  const len = Math.min(name.replace(/\s/g, '').length, MAX_CHARS);
  if (len <= 5) return BASE_FONT_SIZE;
  if (len <= 7) return 9;
  if (len <= 9) return 7.5;
  return MIN_FONT_SIZE;
}
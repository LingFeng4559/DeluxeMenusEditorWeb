// Minecraft Color Code and formatting utility

const COLOR_MAP = {
  '0': '#000000', // Black
  '1': '#0000AA', // Dark Blue
  '2': '#00AA00', // Dark Green
  '3': '#00AAAA', // Dark Aqua
  '4': '#AA0000', // Dark Red
  '5': '#AA00AA', // Dark Purple
  '6': '#FFAA00', // Gold
  '7': '#AAAAAA', // Gray
  '8': '#555555', // Dark Gray
  '9': '#5555FF', // Blue
  'a': '#55FF55', // Green
  'b': '#55FFFF', // Aqua
  'c': '#FF5555', // Red
  'd': '#FF55FF', // Light Purple
  'e': '#FFFF55', // Yellow
  'f': '#FFFFFF', // White
};

/**
 * Parses Minecraft formatted text with & color codes and HEX codes, returning HTML spans.
 * @param {string} text - Raw string with & codes or &#HEX codes
 * @returns {Array<{text: string, style: object}>} Segments with inline CSS styles
 */
export function parseMinecraftText(text) {
  if (!text) return [];

  // Replace &#RRGGBB or <#RRGGBB> with standard format
  let cleanText = String(text)
    .replace(/&#([0-9a-fA-F]{6})/g, '§#$1')
    .replace(/<#([0-9a-fA-F]{6})>/g, '§#$1')
    .replace(/&([0-9a-fA-Fk-rK-R])/g, '§$1');

  // Handle special shift/glyph tags for clean visual representation
  cleanText = cleanText.replace(/<shift:([^>]+)>/g, ' [Shift:$1] ');
  cleanText = cleanText.replace(/<glyph:([^>]+)>/g, ' [Glyph:$1] ');

  const tokens = cleanText.split(/§/);
  const segments = [];

  let currentColor = '#FFFFFF';
  let isBold = false;
  let isItalic = false;
  let isUnderline = false;
  let isStrikethrough = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;

    if (i === 0 && !cleanText.startsWith('§')) {
      // First token with no preceding color code
      segments.push({
        text: token,
        style: { color: currentColor, fontWeight: isBold ? 'bold' : 'normal' }
      });
      continue;
    }

    const code = token.charAt(0).toLowerCase();
    let content = token.slice(1);

    if (code === '#') {
      // HEX Color
      const hex = token.slice(1, 7);
      if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        currentColor = `#${hex}`;
        content = token.slice(7);
      }
    } else if (COLOR_MAP[code]) {
      currentColor = COLOR_MAP[code];
      isBold = false;
      isItalic = false;
      isUnderline = false;
      isStrikethrough = false;
    } else if (code === 'l') {
      isBold = true;
    } else if (code === 'o') {
      isItalic = true;
    } else if (code === 'n') {
      isUnderline = true;
    } else if (code === 'm') {
      isStrikethrough = true;
    } else if (code === 'r') {
      currentColor = '#FFFFFF';
      isBold = false;
      isItalic = false;
      isUnderline = false;
      isStrikethrough = false;
    }

    if (content) {
      segments.push({
        text: content,
        style: {
          color: currentColor,
          fontWeight: isBold ? '700' : '400',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: [
            isUnderline ? 'underline' : '',
            isStrikethrough ? 'line-through' : ''
          ].filter(Boolean).join(' ') || 'none'
        }
      });
    }
  }

  return segments.length > 0 ? segments : [{ text: text, style: { color: '#FFFFFF' } }];
}

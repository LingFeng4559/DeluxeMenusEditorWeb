// Minecraft Color Code and formatting utility
// PERF-5: Added LRU cache (max 200 entries) to avoid re-parsing identical strings

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

// LRU-style cache: max 200 entries, evict oldest when full
const parseCache = new Map();
const MAX_PARSE_CACHE = 200;

/**
 * Parses Minecraft formatted text with & color codes and HEX codes, returning HTML spans.
 * PERF-5: Results are cached by input string to avoid redundant computation.
 * @param {string} text - Raw string with & codes or &#HEX codes
 * @returns {Array<{text: string, style: object}>} Segments with inline CSS styles
 */
export function parseMinecraftText(text) {
  if (!text) return [];

  // Check LRU cache first
  if (parseCache.has(text)) {
    // Move to end (most recently used)
    const cached = parseCache.get(text);
    parseCache.delete(text);
    parseCache.set(text, cached);
    return cached;
  }

  // Pre-process MiniMessage <gradient:#color1:#color2>text</gradient> or <rainbow>text</rainbow>
  let cleanText = String(text)
    .replace(/<gradient:([^>]+)>(.*?)<\/gradient>/gi, (match, colors, innerText) => {
      const colorList = colors.split(':').map((c) => c.trim().startsWith('#') ? c.trim() : `#${c.trim()}`);
      const color1 = colorList[0] || '#FF5555';
      const color2 = colorList[1] || '#55FF55';
      return `<span style="background: linear-gradient(to right, ${color1}, ${color2}); -webkit-background-clip: text; color: transparent; font-weight: bold;">${innerText}</span>`;
    })
    .replace(/<rainbow>(.*?)<\/rainbow>/gi, (match, innerText) => {
      return `<span style="background: linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); -webkit-background-clip: text; color: transparent; font-weight: bold;">${innerText}</span>`;
    })
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

  const result = segments.length > 0 ? segments : [{ text: text, style: { color: '#FFFFFF' } }];

  // Store in LRU cache, evict oldest if over limit
  if (parseCache.size >= MAX_PARSE_CACHE) {
    const oldestKey = parseCache.keys().next().value;
    parseCache.delete(oldestKey);
  }
  parseCache.set(text, result);

  return result;
}

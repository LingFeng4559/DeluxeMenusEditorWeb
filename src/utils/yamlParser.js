import * as yaml from 'js-yaml';

export const DEFAULT_MENU = {
  menu_title: '&6&l選單主介面',
  open_command: 'menu',
  size: 54,
  inventory_type: 'CHEST',
  update_interval: 1,
  items: {
    'sample_item': {
      material: 'CLOCK',
      slot: 0,
      display_name: '&a&l歡迎進入伺服器',
      lore: [
        '&7這是一個 DeluxeMenus 範例物品',
        '&e點擊執行指令！'
      ],
      left_click_commands: [
        '[player] spawn',
        '[sound] BLOCK.NOTE_BLOCK.HAT'
      ]
    }
  }
};

/**
 * Pre-sanitizes DeluxeMenus YAML text before passing to parser.
 * Handles duplicate key definitions (e.g. items: items:) and slot ranges.
 */
function sanitizeYamlText(text) {
  if (!text) return '';

  // Fix consecutive duplicated key definitions like "items:\nitems:"
  let cleaned = text.replace(/^(\s*items:\s*[\r\n]+)+(\s*items:)/gm, '$2');

  return cleaned;
}

/**
 * Parses slot ranges like "0-10" or [ "0-5", "8-10" ] into numeric arrays [0,1,2,3,4,5,8,9,10]
 */
function normalizeSlots(rawSlots) {
  if (rawSlots === undefined || rawSlots === null) return undefined;

  const resultSlots = [];

  const processEntry = (entry) => {
    if (typeof entry === 'number') {
      resultSlots.push(entry);
    } else if (typeof entry === 'string') {
      const rangeMatch = entry.trim().match(/^(\d+)\s*-\s*(\d+)$/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const end = parseInt(rangeMatch[2], 10);
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          resultSlots.push(i);
        }
      } else {
        const parsedNum = parseInt(entry.trim(), 10);
        if (!isNaN(parsedNum)) resultSlots.push(parsedNum);
      }
    }
  };

  if (Array.isArray(rawSlots)) {
    rawSlots.forEach(processEntry);
  } else {
    processEntry(rawSlots);
  }

  return resultSlots.length > 0 ? Array.from(new Set(resultSlots)) : undefined;
}

/**
 * Parses DeluxeMenus YAML text into a standard JS menu model with high fault tolerance.
 */
export function parseYamlToMenu(yamlText) {
  try {
    const sanitizedText = sanitizeYamlText(yamlText);

    // Use json: true option to allow duplicate key overrides without crashing
    const doc = yaml.load(sanitizedText, { json: true });

    if (!doc || typeof doc !== 'object') {
      return { menu: DEFAULT_MENU, error: 'YAML 內容無效' };
    }

    let menuData = doc;
    if (doc.gui_menus && typeof doc.gui_menus === 'object') {
      const keys = Object.keys(doc.gui_menus);
      if (keys.length > 0) {
        menuData = doc.gui_menus[keys[0]];
      }
    }

    // Process items and expand slot ranges
    const items = {};
    if (menuData.items && typeof menuData.items === 'object') {
      for (const [itemKey, itemVal] of Object.entries(menuData.items)) {
        if (!itemVal || typeof itemVal !== 'object') continue;

        const processedItem = { ...itemVal };

        // Normalize slots array (e.g. "0-10" => [0,1,2,3,4,5,6,7,8,9,10])
        if (processedItem.slots !== undefined) {
          processedItem.slots = normalizeSlots(processedItem.slots);
        }

        items[itemKey] = processedItem;
      }
    }

    const menu = {
      menu_title: menuData.menu_title || '&eMenu',
      open_command: menuData.open_command || menuData.command || '',
      size: Number(menuData.size) || 54,
      inventory_type: menuData.inventory_type || 'CHEST',
      update_interval: menuData.update_interval || 1,
      open_requirement: menuData.open_requirement || null,
      items
    };

    return { menu, error: null };
  } catch (err) {
    return { menu: null, error: err.message };
  }
}

/**
 * Serializes JS menu model into a clean DeluxeMenus YAML string.
 */
export function dumpMenuToYaml(menu) {
  if (!menu) return '';

  const cleanData = {
    menu_title: menu.menu_title,
    ...(menu.open_command ? { open_command: menu.open_command } : {}),
    size: Number(menu.size) || 54,
    ...(menu.inventory_type && menu.inventory_type !== 'CHEST' ? { inventory_type: menu.inventory_type } : {}),
    ...(menu.update_interval ? { update_interval: menu.update_interval } : {}),
    ...(menu.open_requirement ? { open_requirement: menu.open_requirement } : {}),
    items: menu.items || {}
  };

  try {
    return yaml.dump(cleanData, {
      indent: 2,
      noArrayIndent: false,
      quotingType: "'",
      forceQuotes: false,
      lineWidth: -1
    });
  } catch (err) {
    console.error('YAML serialization error:', err);
    return '# Serializing error';
  }
}

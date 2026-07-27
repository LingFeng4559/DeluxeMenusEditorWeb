import minecraftItems from 'minecraft-items';
import officialMultilingualMap from './official_multilingual_items.json';
import { getHdbTextureHashSync, resolveHdbTextureHash } from './hdbResolver';

export function normalizeMaterialName(material) {
  if (!material) return '';
  return String(material)
    .trim()
    .toLowerCase()
    .replace(/^minecraft:/, '');
}

/**
 * Official Minecraft MHF Skull / Mob Head texture mapping dictionary
 */
const MHF_HEAD_MAP = {
  'ZOMBIE_HEAD': 'MHF_Zombie',
  'ZOMBIE_SKULL': 'MHF_Zombie',
  'SKELETON_SKULL': 'MHF_Skeleton',
  'SKELETON_HEAD': 'MHF_Skeleton',
  'WITHER_SKELETON_SKULL': 'MHF_WSkeleton',
  'WITHER_SKELETON_HEAD': 'MHF_WSkeleton',
  'CREEPER_HEAD': 'MHF_Creeper',
  'CREEPER_SKULL': 'MHF_Creeper',
  'DRAGON_HEAD': 'MHF_Golem',
  'PIGLIN_HEAD': 'MHF_PigMan',
  'PLAYER_HEAD': 'steve'
};

/**
 * 100% Authentic 3D Animated & High-Res Game GUI Renders (Exhaustive Coverage)
 */
const SPECIAL_MATERIAL_OVERRIDES = {
  // Command Blocks & Structure
  'COMMAND_BLOCK': [
    'https://minecraft.wiki/images/Invicon_Command_Block.gif',
    'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures/block/command_block_front.png'
  ],
  'CHAIN_COMMAND_BLOCK': [
    'https://minecraft.wiki/images/Invicon_Chain_Command_Block.gif'
  ],
  'REPEATING_COMMAND_BLOCK': [
    'https://minecraft.wiki/images/Invicon_Repeating_Command_Block.gif'
  ],
  'STRUCTURE_BLOCK': [
    'https://minecraft.wiki/images/Invicon_Structure_Block.png'
  ],
  'JIGSAW': [
    'https://minecraft.wiki/images/Invicon_Jigsaw_Block.png'
  ],

  // 3D Animated Special Items
  'NETHER_STAR': [
    'https://minecraft.wiki/images/Invicon_Nether_Star.gif'
  ],
  'END_CRYSTAL': [
    'https://minecraft.wiki/images/Invicon_End_Crystal.gif'
  ],
  'BEACON': [
    'https://minecraft.wiki/images/Invicon_Beacon.png'
  ],
  'ENCHANTING_TABLE': [
    'https://minecraft.wiki/images/Invicon_Enchanting_Table.png'
  ],
  'CONDUIT': [
    'https://minecraft.wiki/images/Invicon_Conduit.png'
  ],
  'RESPAWN_ANCHOR': [
    'https://minecraft.wiki/images/Invicon_Respawn_Anchor.png'
  ],
  'DRAGON_EGG': [
    'https://minecraft.wiki/images/Invicon_Dragon_Egg.png'
  ],

  // Chests
  'CHEST': [
    'https://minecraft.wiki/images/Invicon_Chest.png'
  ],
  'ENDER_CHEST': [
    'https://minecraft.wiki/images/Invicon_Ender_Chest.png'
  ],
  'TRAPPED_CHEST': [
    'https://minecraft.wiki/images/Invicon_Trapped_Chest.png'
  ],

  // Maps
  'FILLED_MAP': [
    'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures/item/filled_map.png',
    'https://assets.mcasset.cloud/1.20.4/assets/minecraft/textures/item/filled_map.png'
  ],

  // All 16 Colored Beds
  'WHITE_BED': ['https://minecraft.wiki/images/Invicon_White_Bed.png'],
  'ORANGE_BED': ['https://minecraft.wiki/images/Invicon_Orange_Bed.png'],
  'MAGENTA_BED': ['https://minecraft.wiki/images/Invicon_Magenta_Bed.png'],
  'LIGHT_BLUE_BED': ['https://minecraft.wiki/images/Invicon_Light_Blue_Bed.png'],
  'YELLOW_BED': ['https://minecraft.wiki/images/Invicon_Yellow_Bed.png'],
  'LIME_BED': ['https://minecraft.wiki/images/Invicon_Lime_Bed.png'],
  'PINK_BED': ['https://minecraft.wiki/images/Invicon_Pink_Bed.png'],
  'GRAY_BED': ['https://minecraft.wiki/images/Invicon_Gray_Bed.png'],
  'LIGHT_GRAY_BED': ['https://minecraft.wiki/images/Invicon_Light_Gray_Bed.png'],
  'CYAN_BED': ['https://minecraft.wiki/images/Invicon_Cyan_Bed.png'],
  'PURPLE_BED': ['https://minecraft.wiki/images/Invicon_Purple_Bed.png'],
  'BLUE_BED': ['https://minecraft.wiki/images/Invicon_Blue_Bed.png'],
  'BROWN_BED': ['https://minecraft.wiki/images/Invicon_Brown_Bed.png'],
  'GREEN_BED': ['https://minecraft.wiki/images/Invicon_Green_Bed.png'],
  'RED_BED': ['https://minecraft.wiki/images/Invicon_Red_Bed.png'],
  'BLACK_BED': ['https://minecraft.wiki/images/Invicon_Black_Bed.png'],

  // All 16 Shulker Boxes
  'SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Shulker_Box.png'],
  'WHITE_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_White_Shulker_Box.png'],
  'ORANGE_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Orange_Shulker_Box.png'],
  'MAGENTA_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Magenta_Shulker_Box.png'],
  'LIGHT_BLUE_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Light_Blue_Shulker_Box.png'],
  'YELLOW_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Yellow_Shulker_Box.png'],
  'LIME_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Lime_Shulker_Box.png'],
  'PINK_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Pink_Shulker_Box.png'],
  'GRAY_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Gray_Shulker_Box.png'],
  'LIGHT_GRAY_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Light_Gray_Shulker_Box.png'],
  'CYAN_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Cyan_Shulker_Box.png'],
  'PURPLE_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Purple_Shulker_Box.png'],
  'BLUE_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Blue_Shulker_Box.png'],
  'BROWN_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Brown_Shulker_Box.png'],
  'GREEN_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Green_Shulker_Box.png'],
  'RED_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Red_Shulker_Box.png'],
  'BLACK_SHULKER_BOX': ['https://minecraft.wiki/images/Invicon_Black_Shulker_Box.png']
};

/**
 * Generates an exhaustive list of texture URL candidates for any material.
 */
export function getTextureCandidates(material) {
  if (!material) return [];

  const matStr = String(material).trim();
  const matUpper = matStr.toUpperCase();
  const norm = normalizeMaterialName(matStr);

  const candidates = [];

  // 1. Check Special Authentic 3D Animated Invicon Overrides (highest priority)
  if (SPECIAL_MATERIAL_OVERRIDES[matUpper]) {
    candidates.push(...SPECIAL_MATERIAL_OVERRIDES[matUpper]);
  }

  // 2. Official Minecraft Wiki Invicon 3D Render Candidates (e.g. Invicon_Oak_Sign.png)
  const pascalName = norm.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('_');
  candidates.push(`https://minecraft.wiki/images/Invicon_${pascalName}.png`);

  // 3. Handle Official Minecraft MHF Mob Heads (ZOMBIE_HEAD, CREEPER_HEAD, etc.)
  if (MHF_HEAD_MAP[matUpper]) {
    const mhfAccount = MHF_HEAD_MAP[matUpper];
    candidates.push(`https://mc-heads.net/head/${mhfAccount}/32`);
    candidates.push(`https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/item/${norm}.png`);
    candidates.push(`https://mc-heads.net/avatar/${mhfAccount}/32`);
  }

  // 4. Base64 Local Memory Cache with alias fallback
  try {
    let cleanQuery = norm.replace(/[^a-z0-9]/g, '');
    if (norm === 'filled_map') cleanQuery = 'mapfilled';
    if (norm === 'white_bed') cleanQuery = 'whitebed';
    if (norm === 'command_block') cleanQuery = 'commandblock';

    const itemMatch = minecraftItems.get(norm) || minecraftItems.get(cleanQuery);
    if (itemMatch && itemMatch.icon) {
      candidates.push(`data:image/png;base64,${itemMatch.icon}`);
    } else {
      const found = minecraftItems.find(norm) || minecraftItems.find(cleanQuery);
      if (found && found.length > 0 && found[0].icon) {
        candidates.push(`data:image/png;base64,${found[0].icon}`);
      }
    }
  } catch (e) {}

  // 5. Handle Head Database (HDB-xxx)
  if (matUpper.startsWith('HDB-')) {
    const hdbId = matStr.slice(4).trim();
    const hash = getHdbTextureHashSync(hdbId);

    resolveHdbTextureHash(hdbId).catch(() => {});

    if (hash) {
      return [
        `https://mc-heads.net/head/${hash}/32`,
        `https://api.mineatar.io/head/${hash}`,
        `https://mc-heads.net/avatar/${hash}/32`
      ];
    } else {
      return [
        `https://mc-heads.net/head/MHF_Question/32`,
        `https://mc-heads.net/avatar/MHF_Question/32`
      ];
    }
  }

  // 6. Handle Custom Player Heads
  if (matUpper.startsWith('HEAD-') || matUpper.startsWith('BASEHEAD-')) {
    let name = 'steve';
    if (matUpper.startsWith('HEAD-')) {
      name = matStr.slice(5).replace(/%/g, '');
    }
    return [
      `https://mc-heads.net/head/${name || 'steve'}/32`,
      `https://api.mineatar.io/head/${name || 'steve'}`,
      `https://mc-heads.net/avatar/${name || 'steve'}/32`
    ];
  }

  let assetName = norm;
  if (norm === 'clock') assetName = 'clock_00';
  if (norm === 'compass') assetName = 'compass_00';
  if (norm === 'filled_map') assetName = 'map_filled';
  if (norm === 'writable_book') assetName = 'writable_book';
  if (norm === 'redstone_torch') assetName = 'redstone_torch';

  const familyBase = norm
    .replace(/_(stairs|slab|fence|fence_gate|button|pressure_plate|door|trapdoor|wall)$/, '')
    .replace(/_stained_glass_pane$/, '_stained_glass')
    .replace(/_stained_glass$/, '_stained_glass');

  // 7. 1.20.4 Verified Branch CDN URLs
  candidates.push(`https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/item/${assetName}.png`);
  candidates.push(`https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/block/${assetName}.png`);

  candidates.push(`https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures/item/${assetName}.png`);
  candidates.push(`https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures/block/${assetName}.png`);

  candidates.push(`https://assets.mcasset.cloud/1.20.4/assets/minecraft/textures/item/${assetName}.png`);
  candidates.push(`https://assets.mcasset.cloud/1.20.4/assets/minecraft/textures/block/${assetName}.png`);

  if (norm.includes('door')) {
    candidates.push(`https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/block/${norm}_bottom.png`);
    candidates.push(`https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/item/${norm}.png`);
  }

  if (familyBase && familyBase !== norm) {
    candidates.push(`https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/block/${familyBase}_planks.png`);
    candidates.push(`https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/block/${familyBase}.png`);
    candidates.push(`https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.4/assets/minecraft/textures/block/${familyBase}_log.png`);
    candidates.push(`https://assets.mcasset.cloud/1.20.4/assets/minecraft/textures/block/${familyBase}_planks.png`);
    candidates.push(`https://assets.mcasset.cloud/1.20.4/assets/minecraft/textures/block/${familyBase}.png`);
  }

  return candidates;
}

/**
 * Returns all items with pre-loaded official multilingual translations.
 */
export function getAllMinecraftItems(currentLangCode = 'zh_TW', customItemNames = {}) {
  const mergedMap = new Map();
  const langKey = String(currentLangCode).toLowerCase().replace('-', '_');

  const activeOfficialDict = officialMultilingualMap[langKey] || officialMultilingualMap['zh_tw'] || officialMultilingualMap['en_us'] || {};
  const zhTwDict = officialMultilingualMap['zh_tw'] || {};
  const enUsDict = officialMultilingualMap['en_us'] || {};

  const baseKeys = new Set([
    ...Object.keys(officialMultilingualMap['zh_tw'] || {}),
    ...Object.keys(officialMultilingualMap['en_us'] || {})
  ]);

  baseKeys.forEach(id => {
    const localName = customItemNames[id] || customItemNames[id.toLowerCase()] || activeOfficialDict[id] || zhTwDict[id] || enUsDict[id] || id;
    const zhName = zhTwDict[id] || localName;
    const enName = enUsDict[id] || id.replace(/_/g, ' ');

    mergedMap.set(id, {
      id,
      name: enName,
      zhName: zhName,
      localName: localName,
      searchableText: `${id} ${enName} ${zhName} ${localName} ${Object.values(officialMultilingualMap).map(m => m[id]).filter(Boolean).join(' ')}`.toLowerCase()
    });
  });

  try {
    const list = minecraftItems.find('') || [];
    list.forEach(itm => {
      const id = itm.name.toUpperCase().replace(/\s+/g, '_');
      if (!mergedMap.has(id)) {
        const localName = customItemNames[id] || customItemNames[id.toLowerCase()] || activeOfficialDict[id] || itm.name;
        mergedMap.set(id, {
          id,
          name: itm.name,
          zhName: itm.name,
          localName: localName,
          searchableText: `${id} ${itm.name} ${localName}`.toLowerCase()
        });
      }
    });
  } catch (e) {}

  if (customItemNames && typeof customItemNames === 'object') {
    for (const [rawKey, nameVal] of Object.entries(customItemNames)) {
      const uKey = rawKey.toUpperCase().replace(/\s+/g, '_');
      if (!mergedMap.has(uKey)) {
        mergedMap.set(uKey, {
          id: uKey,
          name: nameVal,
          zhName: nameVal,
          customName: nameVal,
          searchableText: `${uKey} ${nameVal}`.toLowerCase()
        });
      }
    }
  }

  return Array.from(mergedMap.values());
}

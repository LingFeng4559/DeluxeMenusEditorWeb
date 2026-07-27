import fs from 'fs';

const LOCALES_TO_FETCH = [
  { code: 'zh_tw', name: '繁體中文' },
  { code: 'zh_cn', name: '簡體中文' },
  { code: 'ja_jp', name: '日本語' },
  { code: 'en_us', name: 'English' },
  { code: 'ko_kr', name: '한국어' },
  { code: 'ru_ru', name: 'Русский' },
  { code: 'de_de', name: 'Deutsch' },
  { code: 'fr_fr', name: 'Français' },
  { code: 'es_es', name: 'Español' }
];

async function downloadAllLangs() {
  console.log('正在從 Minecraft 官方資產庫一次性下載全語言正統字典...');

  const multilingualDict = {};

  for (const { code, name } of LOCALES_TO_FETCH) {
    const url = `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/lang/${code}.json`;
    try {
      console.log(`[${name} ${code}] 正在下載...`);
      const res = await fetch(url);
      const txt = await res.text();
      const clean = txt.replace(/^\uFEFF/, '').trim();
      const data = JSON.parse(clean);

      const itemDict = {};
      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith('item.minecraft.') || k.startsWith('block.minecraft.')) {
          const matKey = k.replace('item.minecraft.', '').replace('block.minecraft.', '').toUpperCase();
          itemDict[matKey] = v;
        }
      }

      multilingualDict[code] = itemDict;
      console.log(`✓ [${name}] 下載完成，過濾出 ${Object.keys(itemDict).length} 個道具名稱！`);
    } catch (e) {
      console.warn(`✗ [${name}] 下載失敗:`, e.message);
    }
  }

  fs.writeFileSync('./src/utils/official_multilingual_items.json', JSON.stringify(multilingualDict, null, 2));
  console.log('已成功將全套多國語言官方字典儲存至 ./src/utils/official_multilingual_items.json');
}

downloadAllLangs();

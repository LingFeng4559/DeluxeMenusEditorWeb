import JSZip from 'jszip';

/**
 * Parses a Minecraft client jar file and extracts available language files from assets/minecraft/lang/
 * @param {File} jarFile - The uploaded .jar file object
 * @returns {Promise<Array<{code: string, fileName: string, data: object}>>}
 */
export async function parseMinecraftJar(jarFile) {
  if (!jarFile) return [];

  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(jarFile);

  const langFiles = [];
  const langFolderPrefix = 'assets/minecraft/lang/';

  // Iterate over files inside the jar
  const entries = Object.keys(loadedZip.files).filter(path => 
    path.startsWith(langFolderPrefix) && path.endsWith('.json')
  );

  for (const filePath of entries) {
    const fileName = filePath.replace(langFolderPrefix, '');
    const code = fileName.replace('.json', '');

    try {
      const contentText = await loadedZip.files[filePath].async('string');
      const rawJson = JSON.parse(contentText);

      // Process raw Minecraft lang JSON (e.g. "item.minecraft.redstone_torch": "紅石火把")
      const itemNames = {};
      const uiTranslations = {};

      for (const [key, val] of Object.entries(rawJson)) {
        if (key.startsWith('item.minecraft.') || key.startsWith('block.minecraft.')) {
          const matName = key
            .replace('item.minecraft.', '')
            .replace('block.minecraft.', '')
            .toUpperCase();
          itemNames[matName] = val;
        }
      }

      langFiles.push({
        code,
        fileName,
        itemNamesCount: Object.keys(itemNames).length,
        localeData: {
          app: {
            title: `DeluxeMenus Editor (${code})`,
            subtitle: `Minecraft Official ${code} locale`
          },
          item_names: itemNames
        }
      });
    } catch (err) {
      console.warn(`Failed to parse lang file ${filePath}:`, err);
    }
  }

  return langFiles;
}

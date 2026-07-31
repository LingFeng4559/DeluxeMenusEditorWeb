import { describe, expect, it } from 'vitest';
import { parseYamlToMenu } from '../utils/yamlParser';
import { getLocalizedTemplateLibrary, TEMPLATE_LIBRARY } from './samples';

describe('built-in template library', () => {
  it.each(Object.entries(TEMPLATE_LIBRARY))('%s is valid and keeps slots within the menu', (_id, template) => {
    const { menu, error } = parseYamlToMenu(template.yaml);
    expect(error).toBeNull();
    expect(menu.menu_title).toBeTruthy();
    expect(menu.open_command).toBeTruthy();
    expect(Object.keys(menu.items).length).toBeGreaterThanOrEqual(6);

    for (const item of Object.values(menu.items)) {
      if (item.slot !== undefined) {
        expect(item.slot).toBeGreaterThanOrEqual(0);
        expect(item.slot).toBeLessThan(menu.size);
      }
      for (const slot of item.slots || []) {
        expect(slot).toBeGreaterThanOrEqual(0);
        expect(slot).toBeLessThan(menu.size);
      }
    }
  });

  it.each(['zh_TW', 'zh_CN', 'en', 'ja_JP'])('provides complete %s variants', (language) => {
    const templates = getLocalizedTemplateLibrary(language);
    expect(Object.keys(templates)).toEqual(Object.keys(TEMPLATE_LIBRARY));
    for (const template of Object.values(templates)) {
      const { menu, error } = parseYamlToMenu(template.yaml);
      expect(error).toBeNull();
      expect(template.label).toBeTruthy();
      expect(menu.menu_title).toBeTruthy();
      expect(Object.values(menu.items).every((item) => item.display_name !== undefined)).toBe(true);
    }
  });

  it('falls back to English for unknown languages', () => {
    expect(getLocalizedTemplateLibrary('unknown')).toEqual(getLocalizedTemplateLibrary('en'));
  });
});

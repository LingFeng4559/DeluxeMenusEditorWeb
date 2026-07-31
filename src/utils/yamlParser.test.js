import { describe, expect, it } from 'vitest';
import { dumpMenuToYaml, parseYamlToMenu } from './yamlParser';

describe('DeluxeMenus YAML adapter', () => {
  it('round-trips menu content and preserves unknown plugin fields', () => {
    const source = `
menu_title: '&6Shop'
open_command:
  - shop
  - store
size: 27
custom_plugin_option:
  enabled: true
items:
  buy:
    material: DIAMOND
    slot: 4
    display_name: '&bDiamond'
`;

    const firstParse = parseYamlToMenu(source);
    expect(firstParse.error).toBeNull();
    expect(firstParse.menu.custom_plugin_option).toEqual({ enabled: true });

    const secondParse = parseYamlToMenu(dumpMenuToYaml(firstParse.menu));
    expect(secondParse.error).toBeNull();
    expect(secondParse.menu.custom_plugin_option).toEqual({ enabled: true });
    expect(secondParse.menu.open_command).toEqual(['shop', 'store']);
    expect(secondParse.menu.items.buy).toMatchObject({
      material: 'DIAMOND',
      slot: 4,
      display_name: '&bDiamond'
    });
  });

  it('expands slot ranges, removes duplicates and enforces the slot limit', () => {
    const { menu, error } = parseYamlToMenu(`
menu_title: Test
size: 54
items:
  border:
    material: BLACK_STAINED_GLASS_PANE
    slots:
      - 0-3
      - 3
      - 52-99999
`);

    expect(error).toBeNull();
    expect(menu.items.border.slots).toEqual([0, 1, 2, 3, 52, 53]);
  });

  it('returns a useful error without replacing the current document on invalid YAML', () => {
    const result = parseYamlToMenu('items: [not: valid');
    expect(result.menu).toBeNull();
    expect(result.error).toBeTypeOf('string');
    expect(result.error.length).toBeGreaterThan(0);
  });

  it('does not serialize internal editor-only requirement metadata', () => {
    const yaml = dumpMenuToYaml({
      menu_title: 'Test',
      size: 9,
      items: {
        item: {
          material: 'STONE',
          slot: 0,
          _req_type: 'permission'
        }
      }
    });

    expect(yaml).not.toContain('_req_type');
  });
});

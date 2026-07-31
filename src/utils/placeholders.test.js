import { describe, expect, it } from 'vitest';
import {
  applyPlaceholderValues,
  findPlaceholders,
  isItemVisibleForPlaceholderValues
} from './placeholders';

describe('placeholder display testing', () => {
  it('finds unique placeholders recursively and reports every location', () => {
    const result = findPlaceholders({
      menu_title: '&aHello %player_name%',
      items: {
        profile: {
          display_name: '%player_name%',
          lore: ['Balance: %vault_eco_balance%', 'World: %player_world%'],
          view_requirement: {
            requirements: {
              state: { input: '%player_world%' }
            }
          }
        }
      }
    });

    expect(result.map((entry) => entry.placeholder)).toEqual([
      '%player_name%',
      '%player_world%',
      '%vault_eco_balance%'
    ]);
    expect(result.find((entry) => entry.placeholder === '%player_name%').locations).toEqual([
      'menu_title',
      'items.profile.display_name'
    ]);
    expect(result.find((entry) => entry.placeholder === '%player_world%').locations).toHaveLength(2);
    expect(result.every((entry) => Array.isArray(entry.options))).toBe(true);
  });

  it('applies only supplied test values and supports intentionally empty values', () => {
    const source = '%player_name% / %server_online% / %unknown%';
    expect(applyPlaceholderValues(source, {
      '%player_name%': 'Alex',
      '%server_online%': ''
    })).toBe('Alex /  / %unknown%');
  });

  it('does not mutate non-string values', () => {
    expect(applyPlaceholderValues(42, { '%value%': 'changed' })).toBe(42);
  });

  it('switches priority variants when a tested string-equals requirement changes', () => {
    const enabledVariant = {
      priority: 1,
      view_requirement: {
        requirements: {
          state: {
            type: 'string equals',
            input: '%player_message_toggle%',
            output: 'on'
          }
        }
      }
    };
    const fallbackVariant = { priority: 2 };

    expect(isItemVisibleForPlaceholderValues(enabledVariant, {})).toBe(true);
    expect(isItemVisibleForPlaceholderValues(fallbackVariant, {})).toBe(true);
    expect(isItemVisibleForPlaceholderValues(enabledVariant, {
      '%player_message_toggle%': 'on'
    })).toBe(true);
    expect(isItemVisibleForPlaceholderValues(enabledVariant, {
      '%player_message_toggle%': 'off'
    })).toBe(false);
    expect(isItemVisibleForPlaceholderValues(fallbackVariant, {
      '%player_message_toggle%': 'off'
    })).toBe(true);
  });

  it('extracts known equality outputs and common opposite values as input options', () => {
    const [result] = findPlaceholders({
      view_requirement: {
        requirements: {
          state: {
            type: 'string equals',
            input: '%player_message_toggle%',
            output: 'on'
          }
        }
      }
    });

    expect(result.placeholder).toBe('%player_message_toggle%');
    expect(result.options).toEqual(['on', 'off']);
  });

  it('supports case-insensitive and numeric display requirements', () => {
    expect(isItemVisibleForPlaceholderValues({
      view_requirement: {
        requirements: {
          group: {
            type: 'string equals ignorecase',
            input: '%group%',
            output: 'VIP'
          },
          level: {
            type: '>=',
            input: '%level%',
            output: '10'
          }
        }
      }
    }, {
      '%group%': 'vip',
      '%level%': '12'
    })).toBe(true);
  });
});

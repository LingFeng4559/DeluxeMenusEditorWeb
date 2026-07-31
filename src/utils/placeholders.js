const PLACEHOLDER_PATTERN = /%[^%\s]+%/g;

export function findPlaceholders(document) {
  const occurrences = new Map();

  const ensureOccurrence = (placeholder) => {
    if (!occurrences.has(placeholder)) {
      occurrences.set(placeholder, { locations: new Set(), options: new Set() });
    }
    return occurrences.get(placeholder);
  };

  const visit = (value, path) => {
    if (typeof value === 'string') {
      for (const placeholder of value.match(PLACEHOLDER_PATTERN) || []) {
        ensureOccurrence(placeholder).locations.add(path);
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, `${path}[${index}]`));
      return;
    }

    if (value && typeof value === 'object') {
      if (typeof value.input === 'string' && value.output !== undefined) {
        const type = String(value.type || 'string equals').trim().toLowerCase();
        const supportsKnownValue = [
          'string equals',
          'string equals ignorecase',
          'string equals ignore case',
          'equals',
          '=='
        ].includes(type);

        if (supportsKnownValue) {
          for (const placeholder of value.input.match(PLACEHOLDER_PATTERN) || []) {
            const output = String(value.output);
            const occurrence = ensureOccurrence(placeholder);
            occurrence.options.add(output);

            const oppositeValues = {
              on: 'off',
              off: 'on',
              true: 'false',
              false: 'true',
              yes: 'no',
              no: 'yes',
              enabled: 'disabled',
              disabled: 'enabled'
            };
            const opposite = oppositeValues[output.toLowerCase()];
            if (opposite) occurrence.options.add(opposite);
          }
        }
      }

      Object.entries(value).forEach(([key, entry]) => visit(entry, path ? `${path}.${key}` : key));
    }
  };

  visit(document, '');

  return Array.from(occurrences, ([placeholder, occurrence]) => ({
    placeholder,
    locations: Array.from(occurrence.locations),
    options: Array.from(occurrence.options)
  })).sort((a, b) => a.placeholder.localeCompare(b.placeholder));
}

export function applyPlaceholderValues(value, placeholderValues = {}) {
  if (typeof value !== 'string') return value;
  return value.replace(PLACEHOLDER_PATTERN, (placeholder) => (
    Object.prototype.hasOwnProperty.call(placeholderValues, placeholder)
      ? String(placeholderValues[placeholder])
      : placeholder
  ));
}

function hasTestValue(value, placeholderValues) {
  if (typeof value !== 'string') return false;
  return (value.match(PLACEHOLDER_PATTERN) || []).some((placeholder) => (
    Object.prototype.hasOwnProperty.call(placeholderValues, placeholder)
  ));
}

function evaluateRequirement(requirement, placeholderValues) {
  if (!requirement || typeof requirement !== 'object') return true;

  // Keep the normal editor comparison view until the user supplies a value
  // for at least one placeholder used by this requirement.
  if (!hasTestValue(requirement.input, placeholderValues)) return true;

  const input = String(applyPlaceholderValues(requirement.input ?? '', placeholderValues));
  const output = String(applyPlaceholderValues(requirement.output ?? '', placeholderValues));
  const type = String(requirement.type || 'string equals').trim().toLowerCase();

  switch (type) {
    case 'string equals':
    case 'equals':
    case '==':
      return input === output;
    case 'string equals ignorecase':
    case 'string equals ignore case':
      return input.toLowerCase() === output.toLowerCase();
    case 'string not equals':
    case '!=':
      return input !== output;
    case 'string contains':
    case 'contains':
      return input.includes(output);
    case 'string not contains':
      return !input.includes(output);
    case '>':
    case 'greater than':
      return Number(input) > Number(output);
    case '>=':
    case 'greater than or equal to':
      return Number(input) >= Number(output);
    case '<':
    case 'less than':
      return Number(input) < Number(output);
    case '<=':
    case 'less than or equal to':
      return Number(input) <= Number(output);
    default:
      // Unknown DeluxeMenus requirement types are not hidden by the simulator.
      return true;
  }
}

export function isItemVisibleForPlaceholderValues(item, placeholderValues = {}) {
  const requirements = item?.view_requirement?.requirements;
  if (!requirements || typeof requirements !== 'object') return true;

  return Object.values(requirements).every((requirement) => (
    evaluateRequirement(requirement, placeholderValues)
  ));
}

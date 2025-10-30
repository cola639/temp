// default check: keep if not null/undefined, not empty string/array, not NaN
const isMeaningful = (v) =>
  v != null && !(Array.isArray(v) && v.length === 0) && !(typeof v === 'string' && v.trim() === '') && !(typeof v === 'number' && Number.isNaN(v));

/**
 * attachIf(b, ['a', arr], ['e', str], ['f', val, customPredicate?], ...)
 */
function attachIf(b, ...entries) {
  for (const [key, value, when = isMeaningful] of entries) {
    if (when(value)) b[key] = value;
  }
  return b;
}

// usage
const b = { c: 1, d: 2 };
attachIf(b, ['a', []], ['x', [1,2]], ['y', '  '], ['z', 'ok']);
// -> { c:1, d:2, x:[1,2], z:'ok' }

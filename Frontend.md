// keep if: not null/undefined, not empty array, not blank string, not NaN
const isMeaningful = (v) =>
  v != null &&
  !(Array.isArray(v) && v.length === 0) &&
  !(typeof v === 'string' && v.trim() === '') &&
  !(typeof v === 'number' && Number.isNaN(v));

/**
 * Mutates `target` by copying only meaningful fields from `payload`.
 * Returns the same `target`.
 */
function attachOptional(target, payload, check = isMeaningful) {
  for (const [k, v] of Object.entries(payload)) {
    if (check(v)) target[k] = v;
  }
  return target;
}

// usage
const b3 = { c: 1, d: 2 };
attachOptional(b3, { a: [], x: [1, 2], y: '', z: 'ok', n: null });
// b3 -> { c: 1, d: 2, x: [1, 2], z: 'ok' }

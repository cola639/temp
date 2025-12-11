// data: 2D array like [ [1, 8, 6], [2, 3, 5] ]
export function getMaxNumber(data: number[][], paddingRatio = 0.2): number {
  let max = -Infinity;

  for (const row of data) {
    for (const value of row) {
      if (typeof value === 'number' && !Number.isNaN(value) && value > max) {
        max = value;
      }
    }
  }

  // handle empty or non-positive data
  if (!Number.isFinite(max) || max <= 0) {
    return 10;
  }

  const raw = max * (1 + paddingRatio); // max + 20%

  return roundUpForRange(raw);
}

function roundUpForRange(value: number): number {
  if (value <= 10) {
    // within 10 → round to 5 or 10
    return value <= 5 ? 5 : 10;
  }

  if (value <= 100) {
    // within 100 → round up to next 10
    return Math.ceil(value / 10) * 10;
  }

  if (value <= 1000) {
    // within 1000 → round up to next 100
    return Math.ceil(value / 100) * 100;
  }

  // optional: for > 1000, round to next 1000
  return Math.ceil(value / 1000) * 1000;
}

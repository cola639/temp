function addCollisionOffsetsAndLabels(option, step = 8) {
  const series = option.series || [];
  if (!series.length) return option;

  const nSeries = series.length;
  const nPoints = series[0].data.length;

  // matrix[seriesIdx][xIdx] = numeric value
  const matrix = series.map((s) => s.data);

  // offsets[seriesIdx][xIdx] = x-offset (px)
  const offsets = Array.from({ length: nSeries }, () =>
    Array(nPoints).fill(0)
  );

  // label flags: whether this point should show the label
  const labelFlags = Array.from({ length: nSeries }, () =>
    Array(nPoints).fill(true) // default: show for non-collisions
  );

  for (let x = 0; x < nPoints; x++) {
    const isEdge = x === 0 || x === nPoints - 1;

    const valueMap = new Map(); // value -> list of series indices
    const allIndicesAtX = [];   // for the "all different" case

    for (let sIdx = 0; sIdx < nSeries; sIdx++) {
      const v = matrix[sIdx][x];
      if (v == null || v === '-') continue;

      allIndicesAtX.push(sIdx);

      const key = String(v);
      if (!valueMap.has(key)) valueMap.set(key, []);
      valueMap.get(key).push(sIdx);
    }

    if (allIndicesAtX.length <= 1) continue;

    let hasCollision = false;

    // 1) handle equal-value groups (collisions)
    for (const [, indices] of valueMap) {
      if (indices.length <= 1) continue;

      hasCollision = true;
      const k = indices.length;
      const base = -((k - 1) / 2) * step;

      indices.forEach((sIdx, i) => {
        // edge x: only dedupe labels, NO offset
        if (!isEdge) {
          offsets[sIdx][x] = base + i * step;
        }
        // label: only first in group shows
        labelFlags[sIdx][x] = i === 0;
      });
    }

    // 2) if not edge, and NO equal-value collisions at this x,
    //    offset all points according to legend order (series order)
    if (!isEdge && !hasCollision) {
      const k = allIndicesAtX.length;
      const base = -((k - 1) / 2) * step;

      allIndicesAtX.forEach((sIdx, i) => {
        offsets[sIdx][x] = base + i * step;
        // labels all stay true (different values)
      });
    }
  }

  // rebuild series: every point becomes an object with:
  // { value, symbolOffset, labelVisible }
  option.series = series.map((s, sIdx) => ({
    ...s,
    label: {
      show: true,
      position: 'top',
      formatter: (p) => {
        const data = p.data;
        const val =
          data && typeof data === 'object' ? data.value : data;
        const visible =
          data && typeof data === 'object'
            ? data.labelVisible
            : true;
        return visible ? val : '';
      },
    },
    data: s.data.map((v, xIdx) => ({
      value: v,
      symbolOffset: offsets[sIdx][xIdx]
        ? [offsets[sIdx][xIdx], 0]
        : [0, 0],
      labelVisible: labelFlags[sIdx][xIdx],
    })),
  }));

  return option;
}

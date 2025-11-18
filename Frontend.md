function addCollisionOffsetsAndLabels(option, step = 8) {
  const series = option.series || [];
  if (!series.length) return option;

  const nSeries = series.length;
  const nPoints = series[0].data.length;

  const matrix = series.map((s) => s.data);

  const offsets = Array.from({ length: nSeries }, () =>
    Array(nPoints).fill(0)
  );
  const labelFlags = Array.from({ length: nSeries }, () =>
    Array(nPoints).fill(true)
  );

  for (let x = 0; x < nPoints; x++) {
    const isEdge = x === 0 || x === nPoints - 1;

    const valueMap = new Map();
    const allIndicesAtX = [];

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

    // same-value groups
    for (const [, indices] of valueMap) {
      if (indices.length <= 1) continue;

      hasCollision = true;
      const k = indices.length;
      const base = -((k - 1) / 2) * step;

      indices.forEach((sIdx, i) => {
        if (!isEdge) {
          offsets[sIdx][x] = base + i * step;
        }
        labelFlags[sIdx][x] = i === 0; // only first shows label
      });
    }

    // all different → legend-order offset
    if (!isEdge && !hasCollision) {
      const k = allIndicesAtX.length;
      const base = -((k - 1) / 2) * step;

      allIndicesAtX.forEach((sIdx, i) => {
        offsets[sIdx][x] = base + i * step;
      });
    }
  }

  option.series = series.map((s, sIdx) => ({
    ...s,
    label: {
      show: true,
      position: 'top',
      align: 'center',
      verticalAlign: 'middle',
      formatter: (p) => {
        const d = p.data;
        const val =
          d && typeof d === 'object' ? d.value : d;
        const visible =
          d && typeof d === 'object'
            ? d.labelVisible
            : true;
        return visible ? val : '';
      },
    },
    data: s.data.map((v, xIdx) => {
      const off = offsets[sIdx][xIdx] || 0;
      return {
        value: v,
        // move the point
        symbolOffset: [off, 0],
        // keep the label centered vertically at the original x
        label: {
          offset: [-off, 0],   // 👈 cancel the symbol's x offset for the text
        },
        labelVisible: labelFlags[sIdx][xIdx],
      };
    }),
  }));

  return option;
}

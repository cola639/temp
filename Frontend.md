/**
 * For each x index, if some series have "close" y values,
 * give their labels vertical offsets so the numbers won't overlap.
 *
 * @param {object} option - ECharts option
 * @param {number} valueThreshold - values closer than this are treated as "close"
 * @param {number} labelStepPx - pixel distance between labels in a cluster
 */
function addCloseValueLabelOffsets(option, valueThreshold = 5, labelStepPx = 10) {
  const series = option.series || [];
  if (!series.length) return option;

  const nSeries = series.length;
  const nPoints = series[0].data.length;

  // matrix[seriesIdx][xIdx] = numeric value
  const matrix = series.map((s) => s.data);

  // labelOffsets[seriesIdx][xIdx] = [xOffset, yOffset] in px
  const labelOffsets = Array.from({ length: nSeries }, () =>
    Array(nPoints).fill([0, 0])
  );

  for (let x = 0; x < nPoints; x++) {
    // collect (seriesIdx, value) for this x
    const list = [];
    for (let sIdx = 0; sIdx < nSeries; sIdx++) {
      const v = matrix[sIdx][x];
      if (v == null || v === '-') continue;
      list.push({ sIdx, value: Number(v) });
    }

    if (list.length <= 1) continue;

    // sort by value so close values are next to each other
    list.sort((a, b) => a.value - b.value);

    // group into clusters of "close" values
    let cluster = [list[0]];
    for (let i = 1; i < list.length; i++) {
      const prev = cluster[cluster.length - 1];
      const cur = list[i];

      if (Math.abs(cur.value - prev.value) <= valueThreshold) {
        cluster.push(cur);
      } else {
        // process previous cluster
        if (cluster.length > 1) applyClusterOffsets(cluster, x);
        cluster = [cur];
      }
    }
    // last cluster
    if (cluster.length > 1) applyClusterOffsets(cluster, x);
  }

  function applyClusterOffsets(cluster, xIdx) {
    const k = cluster.length;
    const base = -((k - 1) / 2) * labelStepPx; // symmetric

    cluster.forEach((item, i) => {
      const yOff = base + i * labelStepPx;
      // only vertical offset; you can add x offset if you want
      labelOffsets[item.sIdx][xIdx] = [0, yOff];
    });
  }

  // rebuild series data & label config
  option.series = series.map((s, sIdx) => ({
    ...s,
    label: {
      show: true,
      position: 'top',
      formatter: (p) => {
        const d = p.data;
        // handle both number and object { value }
        const val =
          d && typeof d === 'object' && d.value != null ? d.value : d;
        return val;
      },
      // this is overridden by per-data-item label.offset below
    },
    data: s.data.map((v, xIdx) => {
      const [xOff, yOff] = labelOffsets[sIdx][xIdx];
      if (!xOff && !yOff) return v; // no need to wrap if no offset

      return {
        value: v,
        label: {
          offset: [xOff, yOff], // move label in px
        },
      };
    }),
  }));

  return option;
}aa 

// 1) helper: add per-point symbolOffset + labelVisible
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
    const valueMap = new Map(); // value -> list of series indices

    for (let sIdx = 0; sIdx < nSeries; sIdx++) {
      const v = matrix[sIdx][x];
      if (v == null || v === '-') continue;

      const key = String(v);
      if (!valueMap.has(key)) valueMap.set(key, []);
      valueMap.get(key).push(sIdx);
    }

    // process collisions at this x
    for (const [, indices] of valueMap) {
      if (indices.length <= 1) continue; // no collision

      const k = indices.length;
      const base = -((k - 1) / 2) * step; // symmetric offsets

      indices.forEach((sIdx, i) => {
        // offset markers
        offsets[sIdx][x] = base + i * step;

        // only the FIRST in the group shows label, others hide
        labelFlags[sIdx][x] = i === 0;
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

// 2) your base option
let option = {
  title: { text: 'Stacked Line' },
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: { feature: { saveAsImage: {} } },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      symbolSize: 8,
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      symbolSize: 8,
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      symbolSize: 8,
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      symbolSize: 8,
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      symbolSize: 8,
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
};

// 3) apply collision logic
option = addCollisionOffsetsAndLabels(option, 8);

// 4) init chart
const dom = document.getElementById('main');
const myChart = echarts.init(dom);
myChart.setOption(option);

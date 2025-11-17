// 1) helper: only offset markers when values collide at same x
function addCollisionOffsets(option, step = 8) {
  const series = option.series || [];
  if (!series.length) return option;

  // assume all series share same x length
  const nSeries = series.length;
  const nPoints = series[0].data.length;

  // matrix[seriesIdx][xIdx] = numeric value
  const matrix = series.map((s) => s.data);

  // offsets[seriesIdx][xIdx] = x-offset in px
  const offsets = Array.from({ length: nSeries }, () =>
    Array(nPoints).fill(0)
  );

  for (let x = 0; x < nPoints; x++) {
    const valueMap = new Map(); // value -> list of seriesIdx

    for (let s = 0; s < nSeries; s++) {
      const v = matrix[s][x];

      // skip empty/null/'-' points
      if (v == null || v === '-') continue;

      const key = String(v);
      if (!valueMap.has(key)) valueMap.set(key, []);
      valueMap.get(key).push(s);
    }

    // for each value that appears in 2+ series at this x
    for (const [, indices] of valueMap) {
      if (indices.length <= 1) continue;

      const k = indices.length;
      // symmetric offsets: e.g. k = 3 → [-step, 0, +step]
      const base = -((k - 1) / 2) * step;

      indices.forEach((sIdx, i) => {
        offsets[sIdx][x] = base + i * step;
      });
    }
  }

  // rebuild series with per-point symbolOffset only when needed
  option.series = series.map((s, sIdx) => ({
    ...s,
    // important: no series-level symbolOffset
    data: s.data.map((v, xIdx) => {
      const off = offsets[sIdx][xIdx];
      if (!off) return v; // no collision → keep pure number
      return {
        value: v,
        symbolOffset: [off, 0], // only move horizontally
      };
    }),
  }));

  return option;
}

// 2) base option
const optionBase = {
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

// 3) apply offsets only where needed
const option = addCollisionOffsets(optionBase, 8);

// 4) init echart & setOption
// make sure you have a <div id="main" style="width:600px;height:400px;"></div>
const dom = document.getElementById('main');
const myChart = echarts.init(dom);
myChart.setOption(option);

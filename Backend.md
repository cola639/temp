// 1) build base option
const xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const lineSeries = [
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
];

// 2) compute a y max so the background bar covers the whole vertical range
const allValues = lineSeries.flatMap(s => s.data);
const yMax = Math.max(...allValues);

// 3) background bar series: one bar per date, very light color
const bgSeries = {
  name: 'BG',
  type: 'bar',
  data: xData.map(() => yMax),      // full-height bar per date
  barGap: '-100%',                  // overlap lines
  barCategoryGap: '60%',           // thickness of the vertical box
  itemStyle: {
    color: 'rgba(0, 128, 255, 0.06)',  // <– tweak color/opacity
  },
  silent: true,                     // no tooltip, no hover
  tooltip: { show: false },
  z: 0,                             // under the lines
};

const option = {
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
    data: xData,
  },
  yAxis: { type: 'value' },
  // put background series first so it renders underneath
  series: [
    bgSeries,
    ...lineSeries.map(s => ({ ...s, z: 1 })),
  ],
};

// 4) init chart
const dom = document.getElementById('main');
const myChart = echarts.init(dom);
myChart.setOption(option);

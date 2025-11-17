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
      symbolSize: 8,
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Union Ads',
      type: 'line',
      symbolSize: 8,
      data: [121, 133, 103, 133, 91, 230, 209], // close to Email
    },
    // ...
  ],
};

// apply label separation (numbers within 5 units will be offset)
option = addCloseValueLabelOffsets(option, 5, 10);

const dom = document.getElementById('main');
const myChart = echarts.init(dom);
myChart.setOption(option);

const total = [120, 132, 101, 134, 90, 230, 210];
const part  = [30, 40, 20, 50, 10, 80, 50];
const remain = total.map((t, i) => t - part[i]);

option = {
  title: { text: 'Stacked Line' },
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['total Line', 'part Line', 'part Bar', 'remain Bar']
  },
  grid: {
    left: '3%', right: '4%', bottom: '3%', containLabel: true
  },
  toolbox: { feature: { saveAsImage: {} } },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: { type: 'value' },
  series: [
    // part Bar（底部红色）
    {
      name: 'part Bar',
      type: 'bar',
      stack: 'total',
      data: part,
      barWidth: 20,
      itemStyle: {
        color: '#FF3B30',
        borderRadius: [0, 0, 0, 0]
      }
    },
    // remain Bar（顶部绿色）
    {
      name: 'remain Bar',
      type: 'bar',
      stack: 'total',
      data: remain,
      barWidth: 20,
      itemStyle: {
        color: '#34C759',
        borderRadius: [6, 6, 0, 0] // 顶部圆角
      }
    },
    // total 折线
    {
      name: 'total Line',
      type: 'line',
      data: total,
      lineStyle: { width: 3, color: '#34C759' },
      itemStyle: { color: '#34C759' },
      symbolSize: 10,
      z: 3
    },
    // part 折线
    {
      name: 'part Line',
      type: 'line',
      data: part,
      lineStyle: { width: 3, color: '#FF3B30' },
      itemStyle: { color: '#FF3B30' },
      symbolSize: 10,
      z: 3
    }
  ]
};

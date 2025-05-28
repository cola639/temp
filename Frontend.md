yAxis: {
  type: "value",
  minInterval: 1, // 最小间隔，确保刻度线显示
  axisLine: {
    show: true // 显示 Y 轴线
  },
  axisTick: {
    show: true // 显示刻度线
  },
  splitLine: {
    show: true, // 网格线，按需开启
    lineStyle: {
      type: "dashed"
    }
  },
  axisLabel: {
    formatter: (v) => {
      return v >= 1000 ? Math.floor(v / 1000) + "K" : v;
    },
    align: "right"
  }
}

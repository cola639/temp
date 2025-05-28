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


tooltip: {
  trigger: "axis",
  axisPointer: {
    type: "shadow"
  },
  formatter: (params) => {
    return params.map(p => {
      const value = p.value >= 1000 ? (p.value / 1000).toFixed(1) + "K" : p.value;
      return `${p.seriesName}: ${value}`;
    }).join("<br/>");
  },
  backgroundColor: "#ffffff",
  borderColor: "#ffffff",
  textStyle: {
    color: "#000"
  },
  extraCssText: "box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 6px;"
}


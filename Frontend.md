const monthNames = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

const monthlyTrends = [
  [1200, 800, 1300, 600, 2000, 300], // 访问量
  [100, 200, 150, 300, 180, 90],     // 失败量
  [50, 20, 10, 40, 30, 25]           // 异常量
];


const option = {
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
    borderWidth: 1,
    textStyle: {
      color: "#000000"
    },
    extraCssText: "box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 6px;"
  },

  legend: {
    data: ["访问量", "失败量", "异常量"]
  },

  xAxis: {
    type: "category",
    data: monthNames
  },

  yAxis: {
    type: "value",
    minInterval: 1,
    axisLine: { show: true },
    axisTick: { show: true },
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed"
      }
    },
    axisLabel: {
      formatter: (v) => v >= 1000 ? (v / 1000).toFixed(1) + "K" : v,
      align: "right"
    }
  },

  grid: {
    left: 60,
    right: 20,
    top: 50,
    bottom: 30
  },

  series: [
    {
      name: "访问量",
      type: "bar",
      data: monthlyTrends[0],
      color: "#1890ff",
      barWidth: 10,
      label: {
        show: true,
        position: "top",
        fontSize: 8,
        color: "black",
        formatter: (d) => d.data === 0 ? "" : d.data
      }
    },
    {
      name: "失败量",
      type: "bar",
      data: monthlyTrends[1],
      color: "#f5222d",
      barWidth: 10,
      label: {
        show: true,
        position: "top",
        fontSize: 8,
        color: "black",
        formatter: (d) => d.data === 0 ? "" : d.data
      }
    },
    {
      name: "异常量",
      type: "bar",
      data: monthlyTrends[2],
      color: "#8c8c8c",
      barWidth: 10,
      label: {
        show: true,
        position: "top",
        fontSize: 8,
        color: "black",
        formatter: (d) => d.data === 0 ? "" : d.data
      }
    }
  ]
};

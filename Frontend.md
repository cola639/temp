const _rawData_month = {
  type: "Month",
  title: ["Violations", "Remediation Plan"],
  dateList: ["February", "March", "April", "May", "June", "July"],
  violationList: [1000, 1300, 1400, 1300, 1200, 900],
  remediationPlanList: [220, 182, 191, 234, 290, 330],
};

function getOption(data) {
  return {
    title: { text: data.type },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: function(params) {
        const sorted = [...params].sort((a, b) => {
          if (a.seriesName === 'Violations') return -1;
          if (b.seriesName === 'Violations') return 1;
          return 0;
        });
        return `${sorted[0].axisValue}<br/>` + sorted.map(item =>
          `${item.marker} ${item.seriesName}: <b>${item.value}</b>`
        ).join('<br/>');
      }
    },
    legend: {
      data: ['Violations', 'Remediation Plan']
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.dateList,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: "Violations",
        type: "line",
        stack: "Total",
        data: data.violationList,
        // 可选: 颜色
        // lineStyle: { color: "#4f6ef7" }
      },
      {
        name: "Remediation Plan",
        type: "line",
        stack: "Total",
        data: data.remediationPlanList,
        // lineStyle: { color: "#5dc796" }
      },
    ],
  };
}

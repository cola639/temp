import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";

// mock 数据
const mockData = [
  { Month: "2024-01", Country: "Germany", Violation: 20, Remediation: 10 },
  { Month: "2024-02", Country: "Germany", Violation: 25, Remediation: 15 },
  { Month: "2024-03", Country: "Germany", Violation: 18, Remediation: 13 },
  { Month: "2024-01", Country: "France", Violation: 15, Remediation: 8 },
  { Month: "2024-02", Country: "France", Violation: 22, Remediation: 14 },
  { Month: "2024-03", Country: "France", Violation: 17, Remediation: 11 }
];

function getOption(data) {
  const countries = Array.from(new Set(data.map(d => d.Country)));
  const months = Array.from(new Set(data.map(d => d.Month))).sort();

  return {
    title: {
      text: "Violation and Remediation"
    },
    tooltip: {
      trigger: "axis"
    },
    legend: {
      data: countries.flatMap(c => [`${c} Violation`, `${c} Remediation`])
    },
    xAxis: {
      type: "category",
      name: "Month",
      data: months
    },
    yAxis: {
      name: "Count"
    },
    series: countries.flatMap(country => [
      {
        name: `${country} Violation`,
        type: "line",
        showSymbol: false,
        data: months.map(
          m =>
            data.find(d => d.Country === country && d.Month === m)?.Violation ?? null
        )
      },
      {
        name: `${country} Remediation`,
        type: "line",
        showSymbol: false,
        data: months.map(
          m =>
            data.find(d => d.Country === country && d.Month === m)?.Remediation ?? null
        )
      }
    ])
  };
}

export default function MyChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);
      chartInstance.setOption(getOption(mockData));
      // 可选：窗口自适应
      const resizeFn = () => chartInstance && chartInstance.resize();
      window.addEventListener('resize', resizeFn);
      // 清理
      return () => {
        window.removeEventListener('resize', resizeFn);
        chartInstance && chartInstance.dispose();
      };
    }
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: 400, minWidth: 600 }}
    />
  );
}

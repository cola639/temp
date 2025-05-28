const option = {
  title: {
    show: false,
  },
  tooltip: {
    trigger: "item",
    formatter: "{b}: {d}%"
  },
  legend: {
    show: false
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["0%", "90%"],
      center: ["50%", "50%"],
      data: [
        {
          value: 1048,
          name: "Passed",
          itemStyle: {
            color: "#52c41a" // 好看的绿色（Ant Design success）
          }
        },
        {
          value: 735,
          name: "Failed",
          itemStyle: {
            color: "#f5222d" // 好看的红色（Ant Design error）
          }
        },
        {
          value: 580,
          name: "Exception",
          itemStyle: {
            color: "#8c8c8c" // 好看的灰色
          }
        }
      ],
      label: {
        show: true,
        position: "outside",
        formatter: ({ name, percent }) => `${percent.toFixed(2)}% (${name})`,
        fontSize: 14
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 10
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};

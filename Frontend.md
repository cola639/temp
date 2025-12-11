const lineData = {
    legend: ['Alegend', 'Blegend', 'Clegend'],
    xData: ['2021-11-01', '2021-11-02', '2021-11-03', '2021-11-04', '2021-11-05', '2021-11-06', '2021-11-07'],
    yData: [
        {
            name: 'Alegend',
            data: [120, 40, 300, 30, 150, 20, 210],
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#2E79FF',
                    lineStyle: {
                        color: {
                            colorStops: [{
                                offset: 0, color: '#8477FF',
                            }, {
                                offset: 1, color: '#5CCAFF'
                            }],
                        },
                        width: 2,
                        shadowOffsetY: 12,
                        shadowColor: 'rgba(59, 138, 254, 0.1)'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(46, 121, 255, 0.2)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(46, 121, 255, 0.0001)' // 100% 处的颜色
                            }],
                        }
                    },
                }
            },
            
        },
        {
            name: 'Blegend',
            data: [220, 182, 191, 234, 290, 330, 310],
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#5AE4E9',
                    lineStyle: {
                        color: {
                            colorStops: [{
                                offset: 0, color: '#5FC5F6',
                            }, {
                                offset: 1, color: '#57F4E2'
                            }],
                        },
                        width: 2,
                        shadowOffsetY: 12,
                        shadowColor: 'rgba(59, 138, 254, 0.1)'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(90, 228, 233, 0.2)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(90, 228, 233, 0.0001)' // 100% 处的颜色
                            }],
                        }
                    },
                }
            },
            
        },
        {
            name: 'Clegend',
            data: [150, 232, 201, 154, 190, 330, 410],
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FA9D58', // legend的颜色
                    lineStyle: { // 线条渐变
                        color: {
                            colorStops: [{
                                offset: 0, color: '#FA8558',
                            }, {
                                offset: 1, color: '#FAAF58'
                            }],
                        },
                        width: 2, // 线条粗细
                        shadowOffsetY: 12, // 阴影线条的偏移量
                        shadowColor: 'rgba(59, 138, 254, 0.1)'  // 阴影线条的颜色
                    },
                    areaStyle: { // 区域渐变
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(250, 157, 88, 0.2)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(250, 157, 88, 0.0001)' // 100% 处的颜色
                            }],
                        }
                    },
                }
            },
            
        }
    ]
}
const option = {
   grid: {
        left: 48,
        top: '18%',
        bottom: '10%',
        right: 48
    },
    legend: {
        selectedMode: false,
        data: this.lineData.legend,
        icon: 'circle',
        itemHeight: 8, // itemHeight + itemWidth设置icon的大小
        itemWidth: 8,
        itemGap: 24,
        left: 5,
        textStyle: {
            color: 'rgba(21, 22, 24, 0.72)'
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,  // 第一个值从原点开始
        axisTick: {
            show: false // 隐藏刻度尺
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(195,202,207,0.3)'
        },
        axisLabel: {
            color: 'rgba(21, 22, 24, 0.72)'
        },
        data: this.lineData.xData
    },
    yAxis: {
        type: 'value',
        axisTick: {
            show: false // 隐藏刻度尺
        },
        axisLine: {
            // 坐标轴线的样式
            lineStyle: {
                color: 'rgba(195,202,207,0)'
            },
            show: false
        },
        splitLine: {
            // 垂直坐标轴的分割线
            lineStyle: {
                color: 'rgba(195,202,207,0.3)'
            }
        },
        axisLabel: {
            // 坐标轴文字样式
            color:  'rgba(21, 22, 24, 0.72)',
            align: 'center',
            margin: 20
        }
    },
    series: this.lineData.yData
}

const bgSeries = {
  name: 'BG',
  type: 'bar',
  data: maxPerX,
  barGap: '-100%',
  barCategoryGap: '60%',
  itemStyle: {
    color: 'rgba(0, 128, 255, 0.06)',
  },
  label: {
    show: false,             // ✅ no number above the bar
  },
  silent: true,
  tooltip: { show: false },
  encode: { tooltip: [] },
  emphasis: { disabled: true },
  z: 0,
};

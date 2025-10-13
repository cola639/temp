function formatDashboardData({ pieChart, monthList, monthlyBarChart, weekDateList, weeklyBarChart }) {
  const pieData = [
    { value: pieChart.nonCompliance, name: 'Non compliance', itemStyle: { color: colors.red } },
    { value: pieChart.compliance,    name: 'Compliance',     itemStyle: { color: colors.green } },
  ];

  const months = monthList.map(i => dayjs(String(i), 'YYYYMM').format('MMM'));
  const weeks  = weekDateList.map(i => dayjs(String(i), 'YYYYMMDD').format('DDMMM'));

  // clone to guarantee new refs
  const monthlyTrends = monthlyBarChart.map(row => [...row]);
  const weeklyTrends  = weeklyBarChart.map(row => [...row]);

  return { pieData, months, weeks, monthlyTrends, weeklyTrends };
}


const next = formatDashboardData(/* api result */);

setDashboardData(prev => ({
  // arrays of objects
  pieData: next.pieData.map(s => ({ ...s })),          // copy each series object

  // arrays of primitives
  months: [...next.months],
  weeks:  [...next.weeks],

  // arrays of arrays
  monthlyTrends: next.monthlyTrends.map(r => [...r]),
  weeklyTrends:  next.weeklyTrends.map(r => [...r]),

  // optional: force remount for stubborn chart libs
  _v: (prev?._v ?? 0) + 1,
}));

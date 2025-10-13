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

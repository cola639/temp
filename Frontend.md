function generateDatesShort(baseDateStr, count, interval) {
  const result = [];
  let base = dayjs(baseDateStr);
  if (!base.isValid()) throw new Error('Invalid date: ' + baseDateStr);

  for (let i = 0; i < count; i++) {
    const d = base.subtract(i * interval, 'day');
    result.push(d.format('MMMDD')); // 月份简写+两位日
  }
  return result;
}

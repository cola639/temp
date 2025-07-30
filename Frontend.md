
function getDurationByMinute(start, end) {
  const s = dayjs(start);
  const e = dayjs(end);

  // 如果在同一分钟内，返回 "00:00"
  if (s.format('YYYY-MM-DD HH:mm') === e.format('YYYY-MM-DD HH:mm')) {
    return "00:00";
  }
  // 跨分钟就返回 00:xx，xx为分钟差
  const diff = Math.abs(e.diff(s, 'minute'));
  return `00:${String(diff).padStart(2, '0')}`;
}

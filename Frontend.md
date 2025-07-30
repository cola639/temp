function getDurationByMinute(start, end) {
  const s = dayjs(start);
  const e = dayjs(end);

  if (s.format('YYYY-MM-DD HH:mm') === e.format('YYYY-MM-DD HH:mm')) {
    return "00:00";
  }
  const diff = Math.abs(e.diff(s, 'minute'));
  const h = String(Math.floor(diff / 60)).padStart(2, '0');
  const m = String(diff % 60).padStart(2, '0');
  return `${h}:${m}`;
}

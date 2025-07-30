function getDurationStr(start, end) {
  const diff = Math.abs(dayjs(end).diff(dayjs(start), 'second'));
  const h = String(Math.floor(diff / 3600)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  return `${h}:${m}`;
}

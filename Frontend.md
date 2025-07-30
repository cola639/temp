
function getDurationStr(start, end) {
  const diff = Math.abs(dayjs(end).diff(dayjs(start), 'second'));
  const m = String(Math.floor(diff / 60)).padStart(2, '0');
  const s = String(diff % 60).padStart(2, '0');
  return `${m}:${s}`;
}

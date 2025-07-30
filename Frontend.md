function getDurationFull(start, end) {
  let s = dayjs(start);
  let e = dayjs(end);
  if (e.isBefore(s)) [s, e] = [e, s];

  const totalSeconds = e.diff(s, 'second');
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const sec = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

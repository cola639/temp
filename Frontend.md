import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function getDurationStr(start, end) {
  const diff = dayjs(end).diff(dayjs(start), 'second');
  const d = dayjs.duration(diff, 'seconds');
  const h = String(Math.floor(d.asHours())).padStart(2, '0');
  const m = String(d.minutes()).padStart(2, '0');
  return `${h}:${m}`;
}

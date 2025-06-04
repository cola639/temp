import dayjs from 'dayjs';

function getUniqueFormattedMonths(dueDateList) {
  const monthSet = new Set();

  dueDateList.forEach(dateStr => {
    const formatted = dayjs(dateStr).format('MMM-YYYY'); // 例：Jul-2025
    monthSet.add(formatted);
  });

  return Array.from(monthSet);
}

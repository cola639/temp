return Array.from(monthSet)
  .sort((a, b) => dayjs(a, 'MMM-YYYY').isAfter(dayjs(b, 'MMM-YYYY')) ? 1 : -1)
  .map((month) => ({ label: month, value: month }));

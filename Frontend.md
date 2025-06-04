import dayjs from 'dayjs';

const generateDueDate = (dueDateList) => {
  if (!Array.isArray(dueDateList) || dueDateList.length === 0) return [];

  const monthSet = new Set();

  dueDateList.forEach((dateStr) => {
    const formatted = dayjs(dateStr).format('MMM-YYYY');
    monthSet.add(formatted); // 去重只保留字符串
  });

  return Array.from(monthSet).map((month) => ({
    label: month,
    value: month,
  }));
};

function query(list, queryObj) {
  const hasAnyValue = Object.values(queryObj).some(
    (v) => v !== undefined && v !== null && v !== ''
  );

  if (!hasAnyValue) return [...list]; // ✅ 返回新数组

  return list.filter((item) => {
    return Object.entries(queryObj).every(([key, val]) => {
      if (val === undefined || val === null || val === '') return true;
      return item[key] === val;
    });
  });
}

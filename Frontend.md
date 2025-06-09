function query(list, queryObj) {
  const hasAnyValue = Object.values(queryObj).some(
    (v) => v !== undefined && v !== null && v !== ''
  );

  if (!hasAnyValue) return [...list];

  return list.filter((item) => {
    return Object.entries(queryObj).some(([key, val]) => {
      if (val === undefined || val === null || val === '') return false;

      const itemVal = item[key];
      if (itemVal === undefined || itemVal === null) return false;

      return String(itemVal).toLowerCase().includes(String(val).toLowerCase());
    });
  });
}

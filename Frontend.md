function smartFilter(list, query) {
  // ✅ 若 query 是空对象，返回全部
  if (!query || Object.keys(query).length === 0) {
    return [...list];
  }

  return list.filter((item) => {
    return Object.entries(query).every(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        return true; // ✅ 忽略空字段
      }

      const itemVal = item[key];

      // ✅ 如果 query 值是数组，任意一项匹配即可
      if (Array.isArray(val)) {
        return val.some(v => {
          if (v === undefined || v === null || v === '') return true;

          if (typeof v === 'number') {
            return itemVal === v;
          }

          if (typeof v === 'string') {
            return (
              typeof itemVal === 'string' &&
              itemVal.toLowerCase().includes(v.toLowerCase())
            );
          }

          return false;
        });
      }

      // ✅ 原有逻辑：数字精确匹配
      if (typeof val === 'number') {
        return itemVal === val;
      }

      // ✅ 原有逻辑：字符串模糊匹配
      if (typeof val === 'string') {
        return (
          typeof itemVal === 'string' &&
          itemVal.toLowerCase().includes(val.toLowerCase())
        );
      }

      return false;
    });
  });
}

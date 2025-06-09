function filterConfigurationList(list, filterObj = {}) {
  // 空对象直接返回新数组（深拷贝可选）
  if (!filterObj || Object.keys(filterObj).length === 0) {
    return [...list]; // ✅ 返回新数组但不影响原始
  }

  return list.filter((item) => {
    return Object.entries(filterObj).every(([key, val]) => {
      if (val === undefined || val === null || val === '') return true;
      return item[key] === val;
    });
  });
}

const handleChange = (checked, item) => {
  const isTotal = item.value === "total";
  const allSubValues = groups.map(g => g.value).filter(v => v !== "total");

  let updated = [...selectedValues];

  if (isTotal) {
    if (checked) {
      // ✅ 勾选 total：选中全部（含 total）
      updated = [...allSubValues, "total"];
    } else {
      // ❌ 取消 total：只取消它自己
      updated = updated.filter(v => v !== "total");
    }
  } else {
    if (checked) {
      updated = [...updated, item.value];
    } else {
      updated = updated.filter(v => v !== item.value);
    }

    const hasAllSubChecked = allSubValues.every(v => updated.includes(v));

    if (hasAllSubChecked) {
      if (!updated.includes("total")) {
        updated.push("total"); // ✅ 子项全选时自动加上 total
      }
    } else {
      updated = updated.filter(v => v !== "total"); // ❌ 子项非全选时取消 total
    }
  }

  setSelectedValues(updated);
  onSearch(field, updated);
};

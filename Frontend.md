const FilterPanelCheckBox = ({ field, onSearch, confirm, groups = [] }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleChange = (checked: boolean, value: string) => {
    let updated: string[];

    if (checked) {
      updated = [...selectedValues, value];
    } else {
      updated = selectedValues.filter((v) => v !== value);
    }

    setSelectedValues(updated);
    onSearch(field, updated); // 🔄 多选传数组
    confirm?.(); // ✅ 搜索后关闭 dropdown（可选）
  };

  return (
    <div style={{ padding: 10, width: 200 }}>
      {groups.map((item) => (
        <Checkbox
          key={item.value}
          checked={selectedValues.includes(item.value)}
          onChange={(e) => handleChange(e.target.checked, item.value)}
        >
          {item.label}
        </Checkbox>
      ))}
    </div>
  );
};

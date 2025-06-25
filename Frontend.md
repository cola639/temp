<Column
  title="Platform"
  dataIndex="platformName"
  width={100}
  minWidth={100}
  // 条件渲染 filterDropdown 和 filterIcon
  {...(platformOptions.length > 1
    ? {
        filterDropdown: ({ confirm }) => (
          <FilterPanelCheckBox
            width={90}
            field="platform"
            groups={platformOptions}
            onSearch={onSearch}
            confirm={confirm}
          />
        ),
        filterIcon: () => (
          <FilterFilled
            style={{
              fontSize: 9,
              color: filterValues.platform?.length > 0 ? "red" : "blue",
            }}
          />
        ),
      }
    : {})}
/>

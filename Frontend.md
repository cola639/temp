useEffect(() => {
  const LINK = ['linkedId', 'linkConfigurationName'];
  const UN_LINK = ['unlinkedId', 'unlinkConfigurationName'];

  const changedKeys = Object.keys(filterValues).filter((key) => {
    const prevVal = preFilterValues.current?.[key];
    const newVal = filterValues[key];
    return prevVal === undefined || prevVal !== newVal;
  });

  changedKeys.forEach((key) => {
    if (LINK.includes(key)) {
      console.log(`🔗 ${key} is a LINK field`);
    } else if (UN_LINK.includes(key)) {
      console.log(`❌ ${key} is an UN_LINK field`);
    } else {
      console.log(`❓ ${key} changed but unknown category`);
    }
  });

  preFilterValues.current = filterValues;
}, [filterValues]);

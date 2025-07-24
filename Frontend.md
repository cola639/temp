formatter: ({ value }) => {
  let str = '';
  if (value >= 1000) {
    str = Math.ceil(value / 1000) + "K";
  } else {
    str = value.toString();
  }
  // 补齐4位（不足4位用空格在左侧补齐）
  return str.padStart(4, ' ');
}

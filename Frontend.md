function formatRhelHtml(str, groupCount = 2) {
  const parts = str.split(',');

  if (parts.length <= groupCount) return str;

  const first =
    parts
      .slice(0, groupCount)
      .join(',')
      .trimEnd() + ',';

  const second = parts.slice(groupCount).join(',').trim();

  return `${first}<br/>${second}`;
}

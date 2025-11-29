function formatRhel(str) {
  const marker = 'RHEL';
  const idx = str.lastIndexOf(marker);
  if (idx <= 0) return str; // nothing to split

  const first = str.slice(0, idx).trimEnd(); // before last RHEL
  const second = str.slice(idx).trim();      // from last RHEL

  return first + '\n' + second;
}
